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
    IReadOnlyList<CodeComponentLiteralProducer> Produces, // literal-string AddCond/RemCond/HasCond patterns
    IReadOnlyList<CodeComponentRuntimePort> RuntimePorts, // PLAN-AST Phase 3: dict-keyed runtime config reads
    IReadOnlyList<string> FollowIntoTypes);               // PLAN-AST Phase 3.1B: extra helper classes the
                                                          // resolver may search for forwarded methods (e.g.
                                                          // ["DestCheck"] for Destructable, whose SetData
                                                          // forwards to DestCheck.SetData(aStrings, this.co))

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
/// PLAN-AST Phase 3 — one runtime-configurable port surfaced by a
/// <c>dict.TryGetValue("KEY", out …)</c> or <c>dict["KEY"]</c> access inside
/// the component's class. Most components read a handful of keys from their
/// guipropmap dictionary at runtime; the value is either set in data
/// (<c>strSignalCond: "IsReadyPumpAir"</c> in a guipropmap entry) or by the
/// player at runtime (<c>strInput01</c>, which is universally empty in
/// shipped data).
/// </summary>
public sealed record CodeComponentRuntimePort(
    string Key,             // e.g. "strSignalCond", "strInput01", "bTurbo"
    string TargetFolder,    // resolved data folder, "" if untyped
    string Source,          // attribution chain
    bool PlayerWired);      // true for strInput0\d+ pattern (player-edit-by-default)

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
        ["GetCondOwner"]         = "condowners", // returns spawned CondOwner; arg is still a condowners/ strName
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
    /// PLAN-AST Phase 3.1B — per-component helper-class allow-list. The
    /// resolver normally caps follow-into at the impl type itself; entries
    /// here extend the lookup to specific helper classes whose name is
    /// referenced by a forwarded call. Currently <c>Destructable</c> forwards
    /// <c>SetData(aStrings)</c> to <c>DestCheck.SetData(aStrings, this.co)</c>
    /// on a different class — that's where the per-index typing actually
    /// happens (<c>aStrings[1]</c>=damage condition, <c>aStrings[2]</c>=loot
    /// switch, <c>aStrings[3]</c>=damage-condition-max). One micro-rule per
    /// component as needed; if a future dispatcher grows a similar second
    /// hop, add a line here.
    /// </summary>
    private static readonly Dictionary<string, string[]> ComponentFollowIntoTypes = new(StringComparer.Ordinal)
    {
        ["Destructable"] = new[] { "DestCheck" },
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

        // Index every class declaration by short name so Phase 2 can do
        // depth-1 "follow-into" resolution: when the dispatcher does
        // `comp.SetData(array[1])` and `comp` is e.g. a Heater, we look up
        // Heater's SetData method body and continue tracing array[1] there.
        // Last-wins on collisions — matches the indexer's overall semantics.
        var typesByName = new Dictionary<string, ClassDeclarationSyntax>(StringComparer.Ordinal);
        foreach (var pt in parsed.Trees)
        {
            foreach (var cls in pt.Tree.GetRoot().DescendantNodes().OfType<ClassDeclarationSyntax>())
            {
                typesByName[cls.Identifier.ValueText] = cls;
            }
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
            var followInto = ComponentFollowIntoTypes.TryGetValue(commandName, out var fi)
                ? (IReadOnlyList<string>)fi
                : Array.Empty<string>();
            var inPorts = ExtractInPorts(body, implementingType, typesByName, followInto);

            var dispatcherSpan = binExpr.GetLocation().GetLineSpan();
            components.Add(new CodeComponent(
                CommandName: commandName,
                ImplementingType: implementingType,
                ArityMin: arity,
                DispatcherFile: dispatcherFile,
                DispatcherLine: dispatcherSpan.StartLinePosition.Line + 1,
                InPorts: inPorts,
                Produces: Array.Empty<CodeComponentLiteralProducer>(),     // filled in below per implementing-type
                RuntimePorts: Array.Empty<CodeComponentRuntimePort>(),     // ditto
                FollowIntoTypes: followInto));
        }

        // For each unique implementing type, sweep its declaration for literal
        // cond-touch calls + dict-keyed runtime port reads, and attribute
        // them to all components that share the type.
        var produceCache = new Dictionary<string, IReadOnlyList<CodeComponentLiteralProducer>>(StringComparer.Ordinal);
        var runtimePortCache = new Dictionary<string, IReadOnlyList<CodeComponentRuntimePort>>(StringComparer.Ordinal);

        for (var i = 0; i < components.Count; i++)
        {
            var c = components[i];
            if (string.IsNullOrEmpty(c.ImplementingType)) continue;
            if (!produceCache.TryGetValue(c.ImplementingType, out var producers))
            {
                producers = ScanComponentClassForCondCalls(parsed, c.ImplementingType);
                produceCache[c.ImplementingType] = producers;
            }
            if (!runtimePortCache.TryGetValue(c.ImplementingType, out var rPorts))
            {
                rPorts = ScanComponentClassForRuntimePorts(c.ImplementingType, typesByName);
                runtimePortCache[c.ImplementingType] = rPorts;
            }
            components[i] = c with { Produces = producers, RuntimePorts = rPorts };
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
    /// PLAN-AST Phase 2 — for each <c>array[i]</c> access in the dispatcher
    /// branch, classify port [i]'s target folder via a small flow analyzer.
    /// Five resolution patterns, depth-1 follow-into through the implementing
    /// type's methods + field assignments. Anything beyond falls through as
    /// untyped (still recorded so the modder knows the slot is consumed).
    ///
    /// Patterns, applied in order:
    /// <list type="number">
    ///   <item><b>A — direct.</b> <c>DataHandler.GetX(array[i])</c>: port [i] =
    ///         folder for <c>GetX</c> via <see cref="KnownGetters"/>.</item>
    ///   <item><b>B/C — pass-through method call.</b> <c>comp.M(array[i])</c>
    ///         or <c>comp.M(arg0, array[i], …)</c> on the implementing type:
    ///         look up <c>M</c>, find <c>DataHandler.GetX(paramN)</c> in M's
    ///         body where <c>paramN</c> is the matching parameter — covers
    ///         Heater / Wound / Rotor.</item>
    ///   <item><b>D — whole-array forwarding.</b> <c>comp.M(array)</c>: recurse
    ///         into M's body, treating M's parameter as the new "array"
    ///         variable. Lets us see <c>aStrings[i] = this.field</c> +
    ///         <c>DataHandler.GetX(this.field)</c> chains — covers Electrical.</item>
    ///   <item><b>E — direct field assignment.</b> <c>comp.field = array[i]</c>:
    ///         find <c>DataHandler.GetX(this.field)</c> elsewhere in the impl
    ///         type — covers Explosion.</item>
    /// </list>
    ///
    /// Patterns within a method's body share the same machinery via
    /// <see cref="ResolvePortFromArray"/>; the recursion is bounded at depth 1
    /// to keep the analysis tractable. PLAN-AST's framing of "use the full
    /// SemanticModel" turned out unnecessary in practice — the call shapes
    /// are syntactically obvious within the implementing type.
    /// </summary>
    private static IReadOnlyList<CodeComponentInPort> ExtractInPorts(
        StatementSyntax body,
        string implementingType,
        Dictionary<string, ClassDeclarationSyntax> typesByName,
        IReadOnlyList<string> followIntoTypes)
    {
        ClassDeclarationSyntax? implType = null;
        if (!string.IsNullOrEmpty(implementingType))
            typesByName.TryGetValue(implementingType, out implType);

        // Pre-resolve helper classes once. Phase 3.1B — Pattern D's whole-
        // array forwarding searches the union of [implType] ∪ FollowIntoTypes
        // for the called method, so a `destCheck.SetData(aStrings, this.co)`
        // inside `Destructable.SetData` follows into DestCheck.
        var followTypes = followIntoTypes
            .Select(name => typesByName.TryGetValue(name, out var t) ? t : null)
            .Where(t => t != null)
            .Select(t => t!)
            .ToList();

        var portsByIndex = new Dictionary<int, CodeComponentInPort>();

        // Discover every array[i] access we should try to resolve. Two
        // sources:
        //   (a) direct accesses in the dispatcher branch body, e.g.
        //       `DataHandler.GetX(array[1])` or `comp.M(array[2])`;
        //   (b) accesses inside a method receiving the WHOLE array
        //       (`comp.M(array)`), since Electrical / Destructable index
        //       the array only after the forwarding hop.
        var indices = new HashSet<int>();
        DiscoverIndices("array", body, implType, followTypes, indices, depth: 0);

        foreach (var idx in indices)
        {
            var (folder, source) = ResolvePortFromArray("array", idx, body, implType, followTypes, depth: 0);
            portsByIndex[idx] = new CodeComponentInPort(
                Index: idx,
                TargetFolder: folder,
                Source: string.IsNullOrEmpty(folder) ? "untyped" : source);
        }

        return portsByIndex.OrderBy(kv => kv.Key).Select(kv => kv.Value).ToList();
    }

    /// <summary>
    /// Recursively gather every index <c>I</c> for which <c>arrayVar[I]</c>
    /// is read in <paramref name="scope"/> or in any forwarded method
    /// reachable from it through Patterns B/C/D. Bounded at depth 2 to keep
    /// runtime tractable; that's enough for the deepest known chain
    /// (<c>Destructable</c>: dispatcher → <c>Destructable.SetData</c> →
    /// <c>DestCheck.SetData</c>, where the per-index typing finally happens).
    /// </summary>
    private static void DiscoverIndices(
        string arrayVarName,
        SyntaxNode scope,
        ClassDeclarationSyntax? implType,
        IReadOnlyList<ClassDeclarationSyntax> followTypes,
        HashSet<int> indices,
        int depth)
    {
        foreach (var ea in scope.DescendantNodes().OfType<ElementAccessExpressionSyntax>())
        {
            if (TryArrayLiteralIndex(ea, arrayVarName, out var i) && i >= 1) indices.Add(i);
        }
        if (depth >= 2 || implType is null) return;
        foreach (var inv in scope.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            if (inv.Expression is not MemberAccessExpressionSyntax ma) continue;
            if (!TryFindArrayArgPosition(inv, arrayVarName, out var argPos)) continue;

            var methodName = ma.Name.Identifier.ValueText;
            foreach (var hostType in EnumerateLookupTypes(implType, followTypes))
            {
                var method = hostType.Members.OfType<MethodDeclarationSyntax>()
                    .FirstOrDefault(m => m.Identifier.ValueText == methodName
                        && m.ParameterList.Parameters.Count == inv.ArgumentList.Arguments.Count
                        && m.Body != null);
                if (method?.Body is null) continue;
                if (argPos >= method.ParameterList.Parameters.Count) continue;
                var paramName = method.ParameterList.Parameters[argPos].Identifier.ValueText;
                DiscoverIndices(paramName, method.Body, hostType, followTypes, indices, depth + 1);
                break; // first host wins
            }
        }
    }

    /// <summary>
    /// Locate <paramref name="varName"/> as an exact-identifier argument in
    /// <paramref name="inv"/>'s arg list and return its position. Used by the
    /// whole-array forwarding pass — e.g. <c>destCheck.SetData(aStrings, this.co)</c>
    /// has aStrings at position 0.
    /// </summary>
    private static bool TryFindArrayArgPosition(
        InvocationExpressionSyntax inv,
        string varName,
        out int position)
    {
        for (var i = 0; i < inv.ArgumentList.Arguments.Count; i++)
        {
            if (inv.ArgumentList.Arguments[i].Expression is IdentifierNameSyntax id
                && id.Identifier.ValueText == varName)
            {
                position = i;
                return true;
            }
        }
        position = -1;
        return false;
    }

    private static IEnumerable<ClassDeclarationSyntax> EnumerateLookupTypes(
        ClassDeclarationSyntax? implType,
        IReadOnlyList<ClassDeclarationSyntax> followTypes)
    {
        if (implType != null) yield return implType;
        foreach (var t in followTypes) yield return t;
    }

    /// <summary>
    /// Resolve <c><paramref name="arrayVarName"/>[<paramref name="index"/>]</c>
    /// inside <paramref name="scope"/>. Walks Patterns A/B/C/E on every direct
    /// access, then Pattern D (whole-array forwarding into a method on the
    /// impl type) when nothing more direct matched. Returns
    /// <c>(folder, source-description)</c> or <c>("", _)</c> if untyped.
    /// </summary>
    private static (string folder, string source) ResolvePortFromArray(
        string arrayVarName,
        int index,
        SyntaxNode scope,
        ClassDeclarationSyntax? implType,
        IReadOnlyList<ClassDeclarationSyntax> followTypes,
        int depth)
    {
        // Pass 1: direct accesses arrayVarName[index] and immediate consumers.
        foreach (var ea in scope.DescendantNodes().OfType<ElementAccessExpressionSyntax>())
        {
            if (!TryArrayLiteralIndex(ea, arrayVarName, out var i) || i != index) continue;
            var (folder, source) = TryDirectPatterns(ea, arrayVarName, implType, followTypes, depth);
            if (!string.IsNullOrEmpty(folder)) return (folder, source);
        }

        // Pass 2 (Pattern D): the array variable is forwarded to a method on
        // the impl type — or, with Phase 3.1B's helper-class allow-list, on
        // a follow-into helper class (e.g. Destructable.SetData → DestCheck.
        // SetData(aStrings, this.co)). Recurse into the called method's body
        // using its matching parameter as the new array name. Depth bounded
        // at 2 so the resolver can chain dispatcher → A.SetData → B.SetData
        // (as Destructable does), but no further.
        if (depth >= 2 || implType is null) return ("", "untyped");
        foreach (var inv in scope.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            if (inv.Expression is not MemberAccessExpressionSyntax ma) continue;
            if (!TryFindArrayArgPosition(inv, arrayVarName, out var argPos)) continue;

            var methodName = ma.Name.Identifier.ValueText;
            // Search implType first, then helper classes. When the match
            // lives in a helper class, the recursion uses that class as the
            // new implType so Pattern E's field-walk and the field-usage
            // resolver scan the right type.
            foreach (var hostType in EnumerateLookupTypes(implType, followTypes))
            {
                var method = hostType.Members.OfType<MethodDeclarationSyntax>()
                    .FirstOrDefault(m => m.Identifier.ValueText == methodName
                        && m.ParameterList.Parameters.Count == inv.ArgumentList.Arguments.Count
                        && m.Body != null);
                if (method?.Body is null) continue;
                if (argPos >= method.ParameterList.Parameters.Count) continue;
                var paramName = method.ParameterList.Parameters[argPos].Identifier.ValueText;
                var (folder, source) = ResolvePortFromArray(paramName, index, method.Body, hostType, followTypes, depth + 1);
                if (!string.IsNullOrEmpty(folder))
                {
                    var hop = hostType == implType
                        ? $"{methodName}({paramName}[])"
                        : $"{hostType.Identifier.ValueText}.{methodName}({paramName}[])";
                    return (folder, $"{source} ← {hop}");
                }
                break; // first host wins
            }
        }

        return ("", "untyped");
    }

    /// <summary>
    /// Patterns A / B / C / E applied to a single <c>array[i]</c> access.
    /// Pattern D (whole-array forwarding) is handled by the caller.
    /// </summary>
    private static (string folder, string source) TryDirectPatterns(
        ElementAccessExpressionSyntax ea,
        string arrayVarName,
        ClassDeclarationSyntax? implType,
        IReadOnlyList<ClassDeclarationSyntax> followTypes,
        int depth)
    {
        // Pattern E — the access is the RHS of an assignment to a field on
        // the impl type's instance. Find the field's name and look for
        // DataHandler.GetX(this.field) elsewhere in the type.
        if (ea.Parent is AssignmentExpressionSyntax assign && assign.Right == ea
            && assign.IsKind(SyntaxKind.SimpleAssignmentExpression))
        {
            if (implType != null && TryGetReceiverFieldName(assign.Left, out var fieldName))
            {
                var (fldFolder, fldSource) = ResolveFieldUsage(implType, fieldName);
                if (!string.IsNullOrEmpty(fldFolder)) return (fldFolder, $"{fldSource} ← .{fieldName}=[i]");
            }
            return ("", "field assignment");
        }

        // Patterns A / B / C — array[i] is an argument to a call.
        if (ea.Parent is not ArgumentSyntax arg) return ("", "untyped");
        if (arg.Parent is not ArgumentListSyntax argList) return ("", "untyped");
        if (argList.Parent is not InvocationExpressionSyntax inv) return ("", "untyped");
        if (inv.Expression is not MemberAccessExpressionSyntax ma) return ("", "untyped");

        var calleeName = ma.Name.Identifier.ValueText;
        var argPos = argList.Arguments.IndexOf(arg);

        // Pattern A — DataHandler.GetX(array[i])
        if (ma.Expression is IdentifierNameSyntax dh
            && dh.Identifier.ValueText == "DataHandler"
            && KnownGetters.TryGetValue(calleeName, out var fA))
        {
            return (fA, $"DataHandler.{calleeName}");
        }

        // Patterns B/C — comp.M(...args including array[i]...) on impl type
        // or any FollowInto helper class.
        if (depth >= 1) return ("", "untyped (depth)");
        if (implType is null) return ("", "untyped");
        foreach (var hostType in EnumerateLookupTypes(implType, followTypes))
        {
            var method = hostType.Members.OfType<MethodDeclarationSyntax>()
                .FirstOrDefault(m => m.Identifier.ValueText == calleeName
                    && m.ParameterList.Parameters.Count == argList.Arguments.Count
                    && m.Body != null);
            if (method?.Body is null) continue;
            if (argPos < 0 || argPos >= method.ParameterList.Parameters.Count) continue;
            var paramName = method.ParameterList.Parameters[argPos].Identifier.ValueText;
            var (folder, source) = ResolveParamInMethod(method.Body, paramName, hostType);
            if (!string.IsNullOrEmpty(folder)) return (folder, $"{source} ← {calleeName}({paramName})");
            break;
        }
        return ("", "untyped");
    }

    /// <summary>
    /// Inside a method body, trace where a single named parameter ends up:
    /// either it flows directly into <c>DataHandler.GetX(paramName)</c>, or
    /// it's stored to a field that's later passed to <c>DataHandler.GetX</c>
    /// somewhere in the containing type.
    /// </summary>
    private static (string folder, string source) ResolveParamInMethod(
        SyntaxNode methodBody,
        string paramName,
        ClassDeclarationSyntax implType)
    {
        // Direct: DataHandler.GetX(paramName)
        foreach (var inv in methodBody.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            if (!IsDataHandlerGetter(inv, out var name, out var firstArg)) continue;
            if (firstArg is IdentifierNameSyntax id && id.Identifier.ValueText == paramName)
            {
                if (KnownGetters.TryGetValue(name, out var f)) return (f, $"DataHandler.{name}");
            }
        }

        // Via field: this.field = paramName, then DataHandler.GetX(this.field)
        foreach (var assign in methodBody.DescendantNodes().OfType<AssignmentExpressionSyntax>())
        {
            if (!assign.IsKind(SyntaxKind.SimpleAssignmentExpression)) continue;
            if (assign.Right is not IdentifierNameSyntax rhs || rhs.Identifier.ValueText != paramName) continue;
            if (!TryGetReceiverFieldName(assign.Left, out var fieldName)) continue;
            var (folder, source) = ResolveFieldUsage(implType, fieldName);
            if (!string.IsNullOrEmpty(folder)) return (folder, source);
        }

        return ("", "untyped");
    }

    /// <summary>
    /// Search the implementing type for any typing endpoint that takes
    /// <c>this.field</c> (or bare <c>field</c>) as its first argument — the
    /// folder behind that endpoint transitively types the dispatcher port.
    /// Endpoints: <see cref="KnownGetters"/> (<c>DataHandler.Get*</c>) +
    /// <see cref="CondOwnerCondMethods"/> (<c>co.HasCond</c>, <c>AddCondAmount</c>,
    /// …) + <see cref="ShipCOByIdMethods"/> (<c>ship.GetCOByID</c>). The
    /// CondOwner/Ship surface area was added in Phase 3.1B because
    /// <c>DestCheck</c>'s field consumers are <c>co.HasCond(this.strDamageCond)</c>
    /// / <c>co.AddCondAmount(this.strDamageCond, …)</c> — no DataHandler.Get*
    /// involvement, but the typing target (<c>conditions/</c>) is identical.
    /// </summary>
    private static (string folder, string source) ResolveFieldUsage(
        ClassDeclarationSyntax implType,
        string fieldName)
    {
        foreach (var inv in implType.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            if (inv.Expression is not MemberAccessExpressionSyntax ma) continue;
            if (inv.ArgumentList.Arguments.Count == 0) continue;
            var firstArg = inv.ArgumentList.Arguments[0].Expression;
            if (!IsFieldRef(firstArg, fieldName)) continue;

            var calleeName = ma.Name.Identifier.ValueText;

            // DataHandler.GetX
            if (ma.Expression is IdentifierNameSyntax dh
                && dh.Identifier.ValueText == "DataHandler"
                && KnownGetters.TryGetValue(calleeName, out var f))
            {
                return (f, $"DataHandler.{calleeName}(this.{fieldName})");
            }
            // co-side: HasCond / AddCondAmount / RemoveCond / ZeroCondAmount / …
            if (CondOwnerCondMethods.Contains(calleeName))
            {
                return ("conditions", $".{calleeName}(this.{fieldName})");
            }
            // ship-side: GetCOByID
            if (ShipCOByIdMethods.Contains(calleeName))
            {
                return ("condowners", $".{calleeName}(this.{fieldName})");
            }
        }
        return ("", "untyped");
    }

    private static bool IsFieldRef(ExpressionSyntax expr, string fieldName)
    {
        return (expr is MemberAccessExpressionSyntax fma
                    && fma.Expression is ThisExpressionSyntax
                    && fma.Name.Identifier.ValueText == fieldName)
            || (expr is IdentifierNameSyntax fid && fid.Identifier.ValueText == fieldName);
    }

    /// <summary>
    /// Returns true and pulls the field name when <paramref name="lhs"/> is
    /// <c>this.field</c> or <c>localVar.field</c> (the dispatcher canonically
    /// stashes <c>AddComponent&lt;T&gt;()</c> in a local). The bare-identifier
    /// case is also accepted; without a SemanticModel we don't verify the
    /// receiver's type, but the dispatcher branch is small and the pattern is
    /// canonical (one local of impl type per branch).
    /// </summary>
    private static bool TryGetReceiverFieldName(ExpressionSyntax lhs, out string fieldName)
    {
        switch (lhs)
        {
            case MemberAccessExpressionSyntax ma:
                fieldName = ma.Name.Identifier.ValueText;
                return true;
            case IdentifierNameSyntax id:
                fieldName = id.Identifier.ValueText;
                return true;
        }
        fieldName = "";
        return false;
    }

    private static bool IsDataHandlerGetter(
        InvocationExpressionSyntax inv,
        out string name,
        out ExpressionSyntax? firstArg)
    {
        name = "";
        firstArg = null;
        if (inv.Expression is not MemberAccessExpressionSyntax ma) return false;
        if (ma.Expression is not IdentifierNameSyntax dh || dh.Identifier.ValueText != "DataHandler") return false;
        if (inv.ArgumentList.Arguments.Count == 0) return false;
        name = ma.Name.Identifier.ValueText;
        firstArg = inv.ArgumentList.Arguments[0].Expression;
        return true;
    }

    private static bool TryArrayLiteralIndex(
        ElementAccessExpressionSyntax ea,
        string expectedVarName,
        out int index)
    {
        index = 0;
        if (ea.Expression is not IdentifierNameSyntax id || id.Identifier.ValueText != expectedVarName) return false;
        if (ea.ArgumentList.Arguments.Count != 1) return false;
        if (ea.ArgumentList.Arguments[0].Expression is not LiteralExpressionSyntax lit) return false;
        return int.TryParse(lit.Token.ValueText, out index);
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

    // ──────────────────────────────────────────────────────────────────
    // PLAN-AST Phase 3 — runtime-wired port discovery.
    // ──────────────────────────────────────────────────────────────────

    /// <summary>
    /// Methods on a CondOwner-like receiver whose first arg is a condition name.
    /// </summary>
    private static readonly HashSet<string> CondOwnerCondMethods = new(StringComparer.Ordinal)
    {
        "HasCond", "AddCond", "AddCondAmount", "RemoveCond", "RemCond",
        "GetCondAmount", "GetCondMaxAmount", "SetCondAmount", "ZeroCondAmount",
    };

    /// <summary>
    /// Methods on a Ship-like receiver whose first arg is a CondOwner instance id.
    /// </summary>
    private static readonly HashSet<string> ShipCOByIdMethods = new(StringComparer.Ordinal)
    {
        "GetCOByID",
    };

    /// <summary>
    /// Walks the implementing class for <c>dict.TryGetValue("KEY", out X)</c>
    /// and <c>dict["KEY"]</c> patterns, then traces each value's destination
    /// to type the port. Ports are deduplicated by key (last-wins keeps the
    /// most recent typed sighting).
    ///
    /// Patterns understood:
    /// <list type="bullet">
    ///   <item><c>dict.TryGetValue("K", out this.field)</c> + later use of
    ///         <c>this.field</c> in any DataHandler / CondOwner / Ship method.</item>
    ///   <item><c>dict.TryGetValue("K", out var local)</c> + immediate use of
    ///         <c>local</c> in the same method body.</item>
    ///   <item><c>this.field = dict["K"]</c> + later use of <c>this.field</c>.</item>
    ///   <item><c>dict["K"]</c> directly inside an arg position to a typing
    ///         method (e.g. <c>co.HasCond(dict["K"])</c>).</item>
    /// </list>
    /// </summary>
    private static IReadOnlyList<CodeComponentRuntimePort> ScanComponentClassForRuntimePorts(
        string typeName,
        Dictionary<string, ClassDeclarationSyntax> typesByName)
    {
        if (!typesByName.TryGetValue(typeName, out var implType))
            return Array.Empty<CodeComponentRuntimePort>();

        var portsByKey = new Dictionary<string, CodeComponentRuntimePort>(StringComparer.Ordinal);

        // Pattern 1: dict.TryGetValue("KEY", out X)
        foreach (var inv in implType.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            if (inv.Expression is not MemberAccessExpressionSyntax ma) continue;
            if (ma.Name.Identifier.ValueText != "TryGetValue") continue;
            if (!IsGuiPropMapReceiver(ma.Expression)) continue;
            if (inv.ArgumentList.Arguments.Count != 2) continue;
            var keyArg = inv.ArgumentList.Arguments[0].Expression;
            if (keyArg is not LiteralExpressionSyntax keyLit) continue;
            if (!keyLit.IsKind(SyntaxKind.StringLiteralExpression)) continue;
            var key = keyLit.Token.ValueText;
            if (!IsConfigKeyName(key)) continue;

            var outArg = inv.ArgumentList.Arguments[1];
            var (folder, source) = ResolveRuntimeOutDestination(outArg, inv, implType);
            UpsertPort(portsByKey, key, folder, source);
        }

        // Pattern 2: dict["KEY"] direct access — could be standalone arg or
        // assigned to a field/local.
        foreach (var ea in implType.DescendantNodes().OfType<ElementAccessExpressionSyntax>())
        {
            if (ea.ArgumentList.Arguments.Count != 1) continue;
            if (ea.ArgumentList.Arguments[0].Expression is not LiteralExpressionSyntax keyLit) continue;
            if (!keyLit.IsKind(SyntaxKind.StringLiteralExpression)) continue;
            var key = keyLit.Token.ValueText;
            if (!IsConfigKeyName(key)) continue;
            if (ea.Expression is not (IdentifierNameSyntax or MemberAccessExpressionSyntax)) continue;
            // Filter: only guipropmap-shaped dictionaries. Excludes mapGasMols,
            // mapInfo, mapGUIPropMaps (the OUTER lookup, before resolving to a
            // single CO's gpm), and the like.
            if (!IsGuiPropMapReceiver(ea.Expression)) continue;

            var (folder, source) = ResolveDictAccessConsumer(ea, implType);
            UpsertPort(portsByKey, key, folder, source);
        }

        return portsByKey.Values.OrderBy(p => p.Key, StringComparer.Ordinal).ToList();
    }

    private static void UpsertPort(
        Dictionary<string, CodeComponentRuntimePort> portsByKey,
        string key,
        string folder,
        string source)
    {
        var playerWired = IsPlayerWiredKey(key);
        if (!portsByKey.TryGetValue(key, out var existing))
        {
            portsByKey[key] = new CodeComponentRuntimePort(key, folder, string.IsNullOrEmpty(folder) ? "untyped" : source, playerWired);
            return;
        }
        // Prefer typed sightings over untyped.
        if (string.IsNullOrEmpty(existing.TargetFolder) && !string.IsNullOrEmpty(folder))
        {
            portsByKey[key] = new CodeComponentRuntimePort(key, folder, source, playerWired);
        }
    }

    /// <summary>
    /// <c>dict.TryGetValue("K", out X)</c> — X may be <c>this.field</c>, a
    /// bare field/local identifier, or <c>out var local</c> declaration.
    /// </summary>
    private static (string folder, string source) ResolveRuntimeOutDestination(
        ArgumentSyntax outArg,
        InvocationExpressionSyntax invocation,
        ClassDeclarationSyntax implType)
    {
        // For local-variable destinations we need to bound the search scope —
        // a pre-declared local like `string text` is REUSED across multiple
        // TryGetValue calls in real code (GasPump.SetData reads strInput01,
        // bTurbo, bReverse, bSlowMode, nKnobBus all into the same `text`).
        // Each TryGetValue's value is only valid within its own enclosing
        // if-statement / block, never carrying across reassignments.
        var scope = NearestLocalScope(invocation);

        // out var local — newly-declared local. Narrowed to the enclosing
        // scope just like pre-declared, since the declaration's lifetime
        // matches the surrounding block.
        if (outArg.Expression is DeclarationExpressionSyntax decl
            && decl.Designation is SingleVariableDesignationSyntax svd)
        {
            var localName = svd.Identifier.ValueText;
            if (scope != null) return TraceVariableInScope(scope, localName, implType, invocation);
            return ("", "untyped");
        }

        // out this.field
        if (outArg.Expression is MemberAccessExpressionSyntax ma
            && ma.Expression is ThisExpressionSyntax)
        {
            return TraceFieldInClass(implType, ma.Name.Identifier.ValueText);
        }

        // out fieldOrLocal — bare identifier
        if (outArg.Expression is IdentifierNameSyntax id)
        {
            var name = id.Identifier.ValueText;
            var fieldNames = implType.Members.OfType<FieldDeclarationSyntax>()
                .SelectMany(f => f.Declaration.Variables)
                .Select(v => v.Identifier.ValueText)
                .ToHashSet(StringComparer.Ordinal);
            if (fieldNames.Contains(name))
                return TraceFieldInClass(implType, name);
            if (scope != null) return TraceVariableInScope(scope, name, implType, invocation);
        }

        return ("", "untyped");
    }

    /// <summary>
    /// Smallest syntactic scope where a variable's just-assigned value is
    /// validly traceable: the nearest enclosing <c>IfStatementSyntax</c> (so
    /// we can see uses both in its condition and in its then-body) or
    /// <c>BlockSyntax</c>. Prevents cross-key contamination when a
    /// <c>string text</c> local is reused across multiple TryGetValue calls.
    /// </summary>
    private static SyntaxNode? NearestLocalScope(SyntaxNode invocation)
    {
        foreach (var anc in invocation.Ancestors())
        {
            if (anc is IfStatementSyntax) return anc;
            if (anc is BlockSyntax) return anc;
        }
        return null;
    }

    /// <summary>
    /// <c>dict["K"]</c> — the access expression is in some context. If the
    /// parent is an invocation arg with a known typing method, type accordingly.
    /// If the parent is an assignment (<c>this.field = dict["K"]</c>), trace
    /// the field's downstream usage.
    /// </summary>
    private static (string folder, string source) ResolveDictAccessConsumer(
        ElementAccessExpressionSyntax ea,
        ClassDeclarationSyntax implType)
    {
        // Pattern 2a: `this.field = dict["K"]`
        if (ea.Parent is AssignmentExpressionSyntax assign && assign.Right == ea
            && assign.IsKind(SyntaxKind.SimpleAssignmentExpression))
        {
            if (TryGetReceiverFieldName(assign.Left, out var fieldName))
                return TraceFieldInClass(implType, fieldName);
            return ("", "untyped (field-assign)");
        }

        // Pattern 2b: `someConsumer(dict["K"])`
        if (ea.Parent is ArgumentSyntax arg
            && arg.Parent is ArgumentListSyntax argList
            && argList.Parent is InvocationExpressionSyntax inv2)
        {
            var (folder, src) = ClassifyConsumerCall(inv2, argPosition: argList.Arguments.IndexOf(arg));
            if (!string.IsNullOrEmpty(folder)) return (folder, src);
        }

        return ("", "untyped");
    }

    /// <summary>
    /// Walk forward from a local-variable declaration: any later use of
    /// <paramref name="varName"/> as an arg to a known typing method types
    /// the port. Bounded to <paramref name="scope"/> (typically the enclosing
    /// if-statement or block) to avoid cross-key contamination when the same
    /// <c>out text</c> local is reused across multiple TryGetValue calls.
    /// </summary>
    private static (string folder, string source) TraceVariableInScope(
        SyntaxNode scope,
        string varName,
        ClassDeclarationSyntax implType,
        InvocationExpressionSyntax originatingCall)
    {
        foreach (var inv in scope.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            if (inv == originatingCall) continue; // skip the TryGetValue itself
            for (var i = 0; i < inv.ArgumentList.Arguments.Count; i++)
            {
                var argExpr = inv.ArgumentList.Arguments[i].Expression;
                if (argExpr is IdentifierNameSyntax id && id.Identifier.ValueText == varName)
                {
                    var (f, s) = ClassifyConsumerCall(inv, argPosition: i);
                    if (!string.IsNullOrEmpty(f)) return (f, s);
                }
            }
        }
        // Fallback: assigned to a field for later use? this.field = local
        foreach (var assign in scope.DescendantNodes().OfType<AssignmentExpressionSyntax>())
        {
            if (!assign.IsKind(SyntaxKind.SimpleAssignmentExpression)) continue;
            if (assign.Right is IdentifierNameSyntax rhs && rhs.Identifier.ValueText == varName
                && TryGetReceiverFieldName(assign.Left, out var fieldName))
            {
                var (f, s) = TraceFieldInClass(implType, fieldName);
                if (!string.IsNullOrEmpty(f)) return (f, s);
            }
        }
        return ("", "untyped");
    }

    /// <summary>
    /// Walk every usage of <c>this.field</c> (or bare <c>field</c>) inside
    /// the impl type, look for a known typing method that takes it as an arg.
    /// </summary>
    private static (string folder, string source) TraceFieldInClass(
        ClassDeclarationSyntax implType,
        string fieldName)
    {
        foreach (var inv in implType.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            for (var i = 0; i < inv.ArgumentList.Arguments.Count; i++)
            {
                var argExpr = inv.ArgumentList.Arguments[i].Expression;
                bool matches =
                    (argExpr is MemberAccessExpressionSyntax ma
                     && ma.Expression is ThisExpressionSyntax
                     && ma.Name.Identifier.ValueText == fieldName) ||
                    (argExpr is IdentifierNameSyntax id && id.Identifier.ValueText == fieldName);
                if (!matches) continue;
                var (f, s) = ClassifyConsumerCall(inv, argPosition: i);
                if (!string.IsNullOrEmpty(f)) return (f, s);
            }
        }
        return ("", "untyped");
    }

    /// <summary>
    /// Maps <c>recv.method(args)</c> to a target folder when the call shape
    /// names a typing endpoint. Receivers are matched syntactically (we don't
    /// have the SemanticModel to confirm types) — but the method-name
    /// vocabulary is distinctive enough that false positives are rare.
    /// <paramref name="argPosition"/> — only some methods type their first arg
    /// (HasCond etc.); for safety we only type position 0 unless explicitly
    /// noted.
    /// </summary>
    private static (string folder, string source) ClassifyConsumerCall(
        InvocationExpressionSyntax inv,
        int argPosition)
    {
        if (argPosition != 0) return ("", "untyped"); // first-arg-only for now
        if (inv.Expression is not MemberAccessExpressionSyntax ma) return ("", "untyped");
        var name = ma.Name.Identifier.ValueText;

        // CondOwner-like: HasCond / AddCondAmount / etc.
        if (CondOwnerCondMethods.Contains(name))
            return ("conditions", $".{name}(value)");

        // Ship.GetCOByID (and friends)
        if (ShipCOByIdMethods.Contains(name))
            return ("condowners", $".{name}(value)");

        // DataHandler.GetX
        if (ma.Expression is IdentifierNameSyntax dh
            && dh.Identifier.ValueText == "DataHandler"
            && KnownGetters.TryGetValue(name, out var f))
        {
            return (f, $"DataHandler.{name}");
        }

        return ("", "untyped");
    }

    /// <summary>
    /// Same identifier-shape filter used elsewhere — string literals that look
    /// like config keys (camelCase / snake_case identifiers, length ≥ 2).
    /// Avoids picking up format strings.
    /// </summary>
    private static bool IsConfigKeyName(string s)
    {
        if (string.IsNullOrEmpty(s) || s.Length < 2) return false;
        var c0 = s[0];
        if (!char.IsLetter(c0) && c0 != '_') return false;
        for (var i = 1; i < s.Length; i++)
        {
            var c = s[i];
            if (!char.IsLetterOrDigit(c) && c != '_') return false;
        }
        return true;
    }

    /// <summary>
    /// Heuristic: receiver looks like a guipropmap dictionary. Without a
    /// SemanticModel we can't check the type, but the receiver names used in
    /// the decomp are stable enough to allow-list them by substring match.
    /// Real guipropmap-typed receivers seen in the decomp:
    ///   <c>dictionary</c>, <c>gpm</c>, <c>mapGPM</c>, <c>dictPropMap</c>.
    /// Excludes <c>mapGasMols</c>, <c>mapInfo</c>, <c>mapGUIPropMaps</c> (the
    /// outer dict whose values ARE the per-CO guipropmap), etc.
    /// </summary>
    private static bool IsGuiPropMapReceiver(ExpressionSyntax receiver)
    {
        var name = receiver switch
        {
            IdentifierNameSyntax id => id.Identifier.ValueText,
            MemberAccessExpressionSyntax ma => ma.Name.Identifier.ValueText,
            _ => null,
        };
        if (name is null) return false;
        // Outer mapGUIPropMaps lookup is itself a key→dict map; its keys are
        // CO ids, not config-port keys. Reject explicitly.
        if (name == "mapGUIPropMaps" || name == "mapPropMaps") return false;
        // Lowercase compare for substring matches.
        var lower = name.ToLowerInvariant();
        return lower == "dictionary"
            || lower == "gpm"
            || lower.Contains("propmap")
            || lower.Contains("mapgpm");
    }

    private static bool IsPlayerWiredKey(string s)
    {
        // strInput0\d+ is the canonical "player edits this in the panel UI"
        // pattern — empty by default, value is a runtime CO id once wired.
        if (!s.StartsWith("strInput", StringComparison.Ordinal)) return false;
        var rest = s.Substring("strInput".Length);
        if (rest.Length == 0) return false;
        // Accept "01"/"02"/.. and trailing modifiers ("01Interaction").
        var i = 0;
        while (i < rest.Length && char.IsDigit(rest[i])) i++;
        return i > 0;
    }
}
