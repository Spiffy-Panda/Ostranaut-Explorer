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
            var inPorts = ExtractInPorts(body, implementingType, typesByName);

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
        Dictionary<string, ClassDeclarationSyntax> typesByName)
    {
        ClassDeclarationSyntax? implType = null;
        if (!string.IsNullOrEmpty(implementingType))
            typesByName.TryGetValue(implementingType, out implType);

        var portsByIndex = new Dictionary<int, CodeComponentInPort>();

        // Discover every array[i] access we should try to resolve. Two
        // sources:
        //   (a) direct accesses in the dispatcher branch body, e.g.
        //       `DataHandler.GetX(array[1])` or `comp.M(array[2])`;
        //   (b) accesses inside a method receiving the WHOLE array
        //       (`comp.M(array)`), since Electrical / Destructable index
        //       the array only after the forwarding hop.
        var indices = new HashSet<int>();
        foreach (var ea in body.DescendantNodes().OfType<ElementAccessExpressionSyntax>())
        {
            if (TryArrayLiteralIndex(ea, "array", out var i) && i >= 1) indices.Add(i);
        }
        if (implType != null)
        {
            foreach (var inv in body.DescendantNodes().OfType<InvocationExpressionSyntax>())
            {
                if (inv.Expression is not MemberAccessExpressionSyntax ma) continue;
                if (inv.ArgumentList.Arguments.Count != 1) continue;
                if (inv.ArgumentList.Arguments[0].Expression is not IdentifierNameSyntax argId) continue;
                if (argId.Identifier.ValueText != "array") continue;

                var methodName = ma.Name.Identifier.ValueText;
                var method = implType.Members.OfType<MethodDeclarationSyntax>()
                    .FirstOrDefault(m => m.Identifier.ValueText == methodName
                        && m.ParameterList.Parameters.Count == 1
                        && m.Body != null);
                if (method?.Body is null) continue;
                var paramName = method.ParameterList.Parameters[0].Identifier.ValueText;
                foreach (var ea2 in method.Body.DescendantNodes().OfType<ElementAccessExpressionSyntax>())
                {
                    if (TryArrayLiteralIndex(ea2, paramName, out var i) && i >= 1) indices.Add(i);
                }
            }
        }

        foreach (var idx in indices)
        {
            var (folder, source) = ResolvePortFromArray("array", idx, body, implType, depth: 0);
            portsByIndex[idx] = new CodeComponentInPort(
                Index: idx,
                TargetFolder: folder,
                Source: string.IsNullOrEmpty(folder) ? "untyped" : source);
        }

        return portsByIndex.OrderBy(kv => kv.Key).Select(kv => kv.Value).ToList();
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
        int depth)
    {
        // Pass 1: direct accesses arrayVarName[index] and immediate consumers.
        foreach (var ea in scope.DescendantNodes().OfType<ElementAccessExpressionSyntax>())
        {
            if (!TryArrayLiteralIndex(ea, arrayVarName, out var i) || i != index) continue;
            var (folder, source) = TryDirectPatterns(ea, implType, depth);
            if (!string.IsNullOrEmpty(folder)) return (folder, source);
        }

        // Pass 2 (Pattern D): the whole array variable is forwarded to a
        // method on the impl type — recurse into that method's body using its
        // parameter as the new array name.
        if (depth >= 1 || implType is null) return ("", "untyped");
        foreach (var inv in scope.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            if (inv.Expression is not MemberAccessExpressionSyntax ma) continue;
            // Look for <recv>.M(arrayVarName) — single arg, exactly the variable.
            if (inv.ArgumentList.Arguments.Count != 1) continue;
            if (inv.ArgumentList.Arguments[0].Expression is not IdentifierNameSyntax argId) continue;
            if (argId.Identifier.ValueText != arrayVarName) continue;

            var methodName = ma.Name.Identifier.ValueText;
            var method = implType.Members.OfType<MethodDeclarationSyntax>()
                .FirstOrDefault(m => m.Identifier.ValueText == methodName
                    && m.ParameterList.Parameters.Count == 1
                    && m.Body != null);
            if (method?.Body is null) continue;
            var paramName = method.ParameterList.Parameters[0].Identifier.ValueText;
            var (folder, source) = ResolvePortFromArray(paramName, index, method.Body, implType, depth + 1);
            if (!string.IsNullOrEmpty(folder)) return (folder, $"{source} ← {methodName}({paramName}[])");
        }

        return ("", "untyped");
    }

    /// <summary>
    /// Patterns A / B / C / E applied to a single <c>array[i]</c> access.
    /// Pattern D (whole-array forwarding) is handled by the caller.
    /// </summary>
    private static (string folder, string source) TryDirectPatterns(
        ElementAccessExpressionSyntax ea,
        ClassDeclarationSyntax? implType,
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

        // Patterns B/C — comp.M(...args including array[i]...) on impl type.
        if (depth >= 1) return ("", "untyped (depth)");
        if (implType is null) return ("", "untyped");
        var method = implType.Members.OfType<MethodDeclarationSyntax>()
            .FirstOrDefault(m => m.Identifier.ValueText == calleeName
                && m.ParameterList.Parameters.Count == argList.Arguments.Count
                && m.Body != null);
        if (method?.Body is null) return ("", "untyped");
        if (argPos < 0 || argPos >= method.ParameterList.Parameters.Count) return ("", "untyped");
        var paramName = method.ParameterList.Parameters[argPos].Identifier.ValueText;
        var (folder, source) = ResolveParamInMethod(method.Body, paramName, implType);
        if (!string.IsNullOrEmpty(folder)) return (folder, $"{source} ← {calleeName}({paramName})");
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
    /// Search the implementing type for <c>DataHandler.GetX(this.field)</c>
    /// (or bare <c>field</c>) — that tells us what data folder the field's
    /// values come from, transitively typing the dispatcher port.
    /// </summary>
    private static (string folder, string source) ResolveFieldUsage(
        ClassDeclarationSyntax implType,
        string fieldName)
    {
        foreach (var inv in implType.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            if (!IsDataHandlerGetter(inv, out var name, out var firstArg)) continue;
            if (!KnownGetters.TryGetValue(name, out var f)) continue;
            if (firstArg is MemberAccessExpressionSyntax fma
                && fma.Expression is ThisExpressionSyntax
                && fma.Name.Identifier.ValueText == fieldName)
            {
                return (f, $"DataHandler.{name}(this.{fieldName})");
            }
            if (firstArg is IdentifierNameSyntax fid && fid.Identifier.ValueText == fieldName)
            {
                return (f, $"DataHandler.{name}({fieldName})");
            }
        }
        return ("", "untyped");
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
}
