using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Ostranauts.Decomp;

/// <summary>
/// One entry in <c>CondOwner.AddCommand</c>'s dispatcher table — a "command"
/// the data tree can invoke through a <c>condowners.aUpdateCommands</c> string.
/// PLAN-AST Phase 2 promotes each into a <c>code-component</c> graph node.
/// </summary>
public sealed record CodeComponent(
    string CommandName,                                  // e.g. "GasPump" — leading aUpdateCommands token
    string ImplementingType,                             // e.g. "GasPump" — class added via AddComponent<T>
    int ArityMin,                                        // from `if (array.Length < N) return;`
    string DispatcherFile,                               // relative path to CondOwner.cs
    int DispatcherLine,                                  // line of the matching `array[0] == "X"` literal
    IReadOnlyList<CodeComponentInPort> InPorts,          // typed positional args (when resolvable)
    IReadOnlyList<CodeComponentLiteralProducer> Produces); // literal-string AddCond/RemCond/HasCond patterns

/// <summary>
/// Positional argument of an <c>aUpdateCommands</c> string, resolved (when
/// possible) to a target data folder via the dispatcher's call into
/// <c>DataHandler.GetXxx(array[i])</c>. <see cref="TargetFolder"/> is empty
/// when resolution didn't terminate at a known getter.
/// </summary>
public sealed record CodeComponentInPort(
    int Index,             // 1-based position in the comma-separated string (0 is the command name itself)
    string TargetFolder,   // e.g. "gasrespires", "guipropmaps", "" if untyped
    string Source);        // brief explanation of how the index was resolved (e.g. "DataHandler.GetGasRespire")

/// <summary>
/// One literal-string condition reference inside a component class — a hint
/// at what conditions this code touches at runtime. Verb classification:
/// <c>add</c> (produces) / <c>remove</c> (consumes) / <c>read</c> (observes).
/// </summary>
public sealed record CodeComponentLiteralProducer(
    string ConditionName,
    string Verb,           // "AddCond" | "AddCondAmount" | "RemoveCond" | "RemCond" | "HasCond" | "GetCondAmount" | "ZeroCondAmount"
    string Role,           // "produces" | "consumes" | "observes"
    string MethodName,
    string File,
    int Line);

/// <summary>
/// Phase 2 indexer — finds the <c>CondOwner.AddCommand</c> dispatcher in a
/// parsed decomp tree set and recovers, for each <c>array[0] == "X"</c> branch:
/// <list type="bullet">
///   <item>the command name and minimum arity;</item>
///   <item>the C# class added via <c>gameObject.AddComponent&lt;T&gt;()</c>
///         (or referenced via <c>GetComponent&lt;T&gt;()</c>);</item>
///   <item>typed in-ports for any <c>array[i]</c> that flows directly into a
///         <c>DataHandler.Get*(...)</c> call;</item>
///   <item>literal-string condition refs inside that class's methods (Phase 1
///         already finds them as <c>code-method</c> edges, but Phase 2
///         classifies them as produces/consumes/observes for the component).</item>
/// </list>
///
/// The resolution rules live entirely here (PLAN-AST: "Resolution rules live
/// in the indexer, not the data schemas"). The data-handler getter →
/// folder mapping is a small static table sourced from a one-time read of
/// <c>DataHandler.cs</c>; if a new getter shows up later it just yields an
/// untyped port (no false edges, modder still sees the wire).
/// </summary>
public static class ComponentIndexer
{
    /// <summary>
    /// Map from <c>DataHandler.Get*</c> method name to the data-tree folder
    /// holding the entries it returns. Sourced from
    /// <c>decomp/Assembly-CSharp/DataHandler.cs</c> (one-time inspection) and
    /// cross-checked against base + comment_mod schemas. Missing entries
    /// produce untyped ports rather than wrong edges.
    /// </summary>
    private static readonly Dictionary<string, string> KnownGetters = new(StringComparer.Ordinal)
    {
        ["GetPledge"]            = "pledges",
        ["GetGasRespire"]        = "gasrespires",
        ["GetGUIPropMap"]        = "guipropmaps",
        ["GetCondTrigger"]       = "condtrigs",
        ["GetCondOwnerDef"]      = "condowners",
        ["GetCondRule"]          = "condrules",
        ["GetItemDef"]           = "items",
        ["GetExplosion"]         = "explosions",
        ["GetWound"]             = "wounds",
        ["GetSlot"]              = "slots",
        ["GetSlotEffect"]        = "slot_effects",
        ["GetTicker"]            = "tickers",
        ["GetInteraction"]       = "interactions",
        ["GetLifeEvent"]         = "lifeevents",
        ["GetCareer"]            = "careers",
        ["GetHomeworld"]         = "homeworlds",
        ["GetPersonSpec"]        = "personspecs",
        ["GetShipSpec"]          = "shipspecs",
        ["GetChargeProfile"]     = "chargeprofiles",
        ["GetCrime"]             = "crime",
        ["GetPlot"]              = "plots",
        ["GetPlotBeat"]          = "plot_beats",
        ["GetParallax"]          = "parallax",
        ["GetZoneTrigger"]       = "zone_triggers",
        ["GetAttackMode"]        = "attackmodes",
        ["GetShipAttack"]        = "shipspecs",
        ["GetContext"]           = "context",
        ["GetJob"]               = "jobs",
        ["GetJobItems"]          = "jobitems",
        ["GetRaceTrack"]         = "racing",
        ["GetRaceLeague"]        = "racing",
        ["GetCOOverlay"]         = "cooverlays",
        ["GetAudioEmitter"]      = "audioemitters",
        ["GetPowerInfo"]         = "powerinfos",
        ["GetLight"]             = "lights",
        ["GetLedgerDef"]         = "ledgerdefs",
        ["GetShip"]              = "ships",
        ["GetRoomDef"]           = "rooms",
        ["GetLoot"]              = "loot",
        ["GetColor"]             = "colors",
    };

    /// <summary>
    /// Cond-touching methods on <c>CondOwner</c>, classified by role. Order
    /// is checked-once and the verb dictates whether a literal first-arg is
    /// treated as produces / consumes / observes.
    /// </summary>
    private static readonly Dictionary<string, string> CondVerbRoles = new(StringComparer.Ordinal)
    {
        ["AddCond"]         = "produces",
        ["AddCondAmount"]   = "produces",
        ["RemoveCond"]      = "consumes",
        ["RemCond"]         = "consumes",
        ["ZeroCondAmount"]  = "consumes",
        ["HasCond"]         = "observes",
        ["GetCondAmount"]   = "observes",
        ["GetCondMaxAmount"]= "observes",
    };

    /// <summary>
    /// Walks <paramref name="parsed"/>, locates <c>CondOwner.AddCommand</c>,
    /// and recovers the dispatcher table. Returns one <see cref="CodeComponent"/>
    /// per <c>array[0] == "X"</c> branch found.
    ///
    /// If the dispatcher can't be located the result is empty and a warning
    /// is emitted; the rest of the build proceeds normally.
    /// </summary>
    public static IReadOnlyList<CodeComponent> Index(
        ParsedDecompTreeSet parsed,
        Action<string>? onWarning = null)
    {
        // Locate the dispatcher syntactically. We don't need the full
        // SemanticModel for this part — the receiver of `array[0] == "X"` is
        // unambiguous within AddCommand's scope.
        MethodDeclarationSyntax? dispatcher = null;
        string dispatcherFile = "";
        foreach (var pt in parsed.Trees)
        {
            var root = pt.Tree.GetRoot();
            foreach (var typeDecl in root.DescendantNodes().OfType<ClassDeclarationSyntax>())
            {
                if (typeDecl.Identifier.ValueText != "CondOwner") continue;
                foreach (var m in typeDecl.Members.OfType<MethodDeclarationSyntax>())
                {
                    if (m.Identifier.ValueText != "AddCommand") continue;
                    if (m.ParameterList.Parameters.Count != 1) continue;
                    dispatcher = m;
                    dispatcherFile = pt.RelativePath;
                    break;
                }
                if (dispatcher != null) break;
            }
            if (dispatcher != null) break;
        }

        if (dispatcher == null)
        {
            onWarning?.Invoke("decomp: CondOwner.AddCommand dispatcher not found; PLAN-AST Phase 2 emits no code-component nodes");
            return Array.Empty<CodeComponent>();
        }

        // The dispatcher's body is a chain of `if (array[0] == "X") { ... }
        // else if (array[0] == "Y") { ... }` (sometimes nested inside `else`).
        // Find every comparison literal and then its enclosing then-block.
        var components = new List<CodeComponent>();

        foreach (var binExpr in dispatcher.DescendantNodes().OfType<BinaryExpressionSyntax>())
        {
            if (!binExpr.IsKind(SyntaxKind.EqualsExpression)) continue;
            // Match `array[0] == "X"` only — the dispatcher always indexes [0]
            // for the command name.
            if (binExpr.Left is not ElementAccessExpressionSyntax eaLeft) continue;
            if (eaLeft.Expression is not IdentifierNameSyntax idLeft || idLeft.Identifier.ValueText != "array") continue;
            if (eaLeft.ArgumentList.Arguments.Count != 1) continue;
            var idx = eaLeft.ArgumentList.Arguments[0].Expression;
            if (idx is not LiteralExpressionSyntax lit0 || lit0.Token.ValueText != "0") continue;
            if (binExpr.Right is not LiteralExpressionSyntax litR || !litR.IsKind(SyntaxKind.StringLiteralExpression)) continue;

            var commandName = litR.Token.ValueText;

            // The enclosing then-statement is what runs when this branch matches.
            // Could be the THEN of an `if`, or the body of an `else if` (which
            // is just `if-then` nested inside an `else`).
            var ifStmt = binExpr.AncestorsAndSelf().OfType<IfStatementSyntax>().FirstOrDefault();
            if (ifStmt == null || ifStmt.Condition != binExpr) continue;
            var body = ifStmt.Statement;

            var arity = ExtractArityCheck(body);
            var implementingType = ExtractImplementingType(body);
            var inPorts = ExtractInPorts(body);

            var dispatcherSpan = binExpr.GetLocation().GetLineSpan();
            components.Add(new CodeComponent(
                CommandName: commandName,
                ImplementingType: implementingType,
                ArityMin: arity,
                DispatcherFile: dispatcherFile,
                DispatcherLine: dispatcherSpan.StartLinePosition.Line + 1,
                InPorts: inPorts,
                Produces: Array.Empty<CodeComponentLiteralProducer>())); // filled in below per implementing-type
        }

        // For each unique implementing type, sweep its declaration for literal
        // cond-touch calls and attribute them to all components that use it.
        var produceCache = new Dictionary<string, IReadOnlyList<CodeComponentLiteralProducer>>(StringComparer.Ordinal);

        for (var i = 0; i < components.Count; i++)
        {
            var c = components[i];
            if (string.IsNullOrEmpty(c.ImplementingType)) continue;
            if (!produceCache.TryGetValue(c.ImplementingType, out var producers))
            {
                producers = ScanComponentClassForCondCalls(parsed, c.ImplementingType);
                produceCache[c.ImplementingType] = producers;
            }
            components[i] = c with { Produces = producers };
        }

        return components;
    }

    /// <summary>
    /// Pulls the lower-bound arity from the first
    /// <c>if (array.Length &lt; N) return;</c> guard inside the branch body.
    /// PLAN-AST: each command branch starts with this check; we mirror it so
    /// that the generated graph can report "expects 3 args" without re-parsing.
    /// </summary>
    private static int ExtractArityCheck(StatementSyntax body)
    {
        foreach (var ifStmt in body.DescendantNodesAndSelf().OfType<IfStatementSyntax>())
        {
            if (ifStmt.Condition is not BinaryExpressionSyntax bin) continue;
            if (!bin.IsKind(SyntaxKind.LessThanExpression)) continue;
            // array.Length < N
            if (bin.Left is not MemberAccessExpressionSyntax ma) continue;
            if (ma.Expression is not IdentifierNameSyntax id || id.Identifier.ValueText != "array") continue;
            if (ma.Name.Identifier.ValueText != "Length") continue;
            if (bin.Right is not LiteralExpressionSyntax litN) continue;
            if (int.TryParse(litN.Token.ValueText, out var n)) return n;
        }
        return 1; // command name itself is always present
    }

    /// <summary>
    /// First <c>AddComponent&lt;T&gt;()</c> or <c>GetComponent&lt;T&gt;()</c>
    /// call in the branch — that's the runtime component the wiring adds. If
    /// nothing matches (e.g. <c>OnAddCond</c> populates a dictionary, no
    /// component), returns the empty string.
    /// </summary>
    private static string ExtractImplementingType(StatementSyntax body)
    {
        foreach (var inv in body.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            if (inv.Expression is not MemberAccessExpressionSyntax ma) continue;
            if (ma.Name is not GenericNameSyntax gen) continue;
            var name = gen.Identifier.ValueText;
            if (name != "AddComponent" && name != "GetComponent") continue;
            if (gen.TypeArgumentList.Arguments.Count != 1) continue;
            return gen.TypeArgumentList.Arguments[0].ToString();
        }
        return "";
    }

    /// <summary>
    /// For every <c>array[i]</c> access in the branch (where <c>i</c> is a
    /// literal int), inspect the immediately-enclosing argument context and
    /// classify:
    /// <list type="bullet">
    ///   <item><c>DataHandler.GetXxx(array[i])</c> — port [i] = folder for
    ///         <c>GetXxx</c> via <see cref="KnownGetters"/>.</item>
    ///   <item>Otherwise — port [i] = untyped (still recorded so the modder
    ///         knows the position is consumed).</item>
    /// </list>
    /// PLAN-AST: this is the "one-hop" semantic resolution. Going deeper
    /// (following <c>component.SetData(array)</c> into <c>SetData</c>'s body)
    /// is a Phase 3 nicety; an untyped port is correct, just less rich.
    /// </summary>
    private static IReadOnlyList<CodeComponentInPort> ExtractInPorts(StatementSyntax body)
    {
        var portsByIndex = new Dictionary<int, CodeComponentInPort>();
        foreach (var ea in body.DescendantNodes().OfType<ElementAccessExpressionSyntax>())
        {
            if (ea.Expression is not IdentifierNameSyntax id || id.Identifier.ValueText != "array") continue;
            if (ea.ArgumentList.Arguments.Count != 1) continue;
            if (ea.ArgumentList.Arguments[0].Expression is not LiteralExpressionSyntax lit) continue;
            if (!int.TryParse(lit.Token.ValueText, out var idx)) continue;
            if (idx < 1) continue; // index 0 is the command name itself

            // What's the immediately-enclosing call? Want
            //    SomeCall(array[idx], ...)
            // and we care about SomeCall's name.
            var arg = ea.Parent as ArgumentSyntax;
            var argList = arg?.Parent as ArgumentListSyntax;
            var inv = argList?.Parent as InvocationExpressionSyntax;
            string folder = "";
            string source = "untyped";

            if (inv?.Expression is MemberAccessExpressionSyntax ma)
            {
                var name = ma.Name.Identifier.ValueText;
                // Only treat the call as resolution if the receiver is
                // DataHandler — guards against false positives like
                // gasPump.SetData(array[1], ...) where SetData isn't a getter.
                var isOnDataHandler = ma.Expression is IdentifierNameSyntax recv && recv.Identifier.ValueText == "DataHandler";
                if (isOnDataHandler && KnownGetters.TryGetValue(name, out var f))
                {
                    folder = f;
                    source = $"DataHandler.{name}";
                }
            }

            // First sighting wins — multiple uses of array[i] in the same
            // branch all describe the same port; prefer the typed sighting if
            // we already saw an untyped one.
            if (!portsByIndex.TryGetValue(idx, out var existing) || (string.IsNullOrEmpty(existing.TargetFolder) && !string.IsNullOrEmpty(folder)))
            {
                portsByIndex[idx] = new CodeComponentInPort(idx, folder, source);
            }
        }

        return portsByIndex.OrderBy(kv => kv.Key).Select(kv => kv.Value).ToList();
    }

    /// <summary>
    /// Locate the type declaration named <paramref name="typeName"/> and walk
    /// its method bodies looking for cond-touch calls with a literal first
    /// arg. Each match becomes a <see cref="CodeComponentLiteralProducer"/>.
    /// Multiple matches for the same (cond, verb, line) collapse — duplicates
    /// don't help the modder.
    /// </summary>
    private static IReadOnlyList<CodeComponentLiteralProducer> ScanComponentClassForCondCalls(
        ParsedDecompTreeSet parsed,
        string typeName)
    {
        var producers = new List<CodeComponentLiteralProducer>();
        var seen = new HashSet<(string, string, int, string)>();

        foreach (var pt in parsed.Trees)
        {
            var root = pt.Tree.GetRoot();
            foreach (var typeDecl in root.DescendantNodes().OfType<TypeDeclarationSyntax>())
            {
                if (typeDecl.Identifier.ValueText != typeName) continue;

                foreach (var method in typeDecl.Members.OfType<BaseMethodDeclarationSyntax>())
                {
                    var methodName = method switch
                    {
                        MethodDeclarationSyntax md => md.Identifier.ValueText,
                        ConstructorDeclarationSyntax => ".ctor",
                        _ => "<other>",
                    };

                    SyntaxNode? scope = method.Body;
                    if (scope is null && method.ExpressionBody is { } eb) scope = eb;
                    if (scope is null) continue;

                    foreach (var inv in scope.DescendantNodes().OfType<InvocationExpressionSyntax>())
                    {
                        if (inv.Expression is not MemberAccessExpressionSyntax ma) continue;
                        var verb = ma.Name.Identifier.ValueText;
                        if (!CondVerbRoles.TryGetValue(verb, out var role)) continue;
                        if (inv.ArgumentList.Arguments.Count == 0) continue;
                        var firstArg = inv.ArgumentList.Arguments[0].Expression;
                        if (firstArg is not LiteralExpressionSyntax lit) continue;
                        if (!lit.IsKind(SyntaxKind.StringLiteralExpression)) continue;
                        var name = lit.Token.ValueText;
                        if (string.IsNullOrEmpty(name)) continue;

                        var span = inv.GetLocation().GetLineSpan();
                        var line = span.StartLinePosition.Line + 1;
                        if (!seen.Add((name, verb, line, pt.RelativePath))) continue;

                        producers.Add(new CodeComponentLiteralProducer(
                            ConditionName: name,
                            Verb: verb,
                            Role: role,
                            MethodName: methodName,
                            File: pt.RelativePath,
                            Line: line));
                    }
                }
            }
        }
        return producers;
    }
}
