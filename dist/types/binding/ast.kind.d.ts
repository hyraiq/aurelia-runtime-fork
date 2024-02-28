declare const enum ExpressionKind {
    CallsFunction = 128,
    HasAncestor = 256,
    IsPrimary = 512,
    IsLeftHandSide = 1024,
    HasBind = 2048,
    HasUnbind = 4096,
    IsAssignable = 8192,
    IsLiteral = 16384,
    IsResource = 32768,
    IsForDeclaration = 65536,
    Type = 31,
    AccessThis = 1793,
    AccessScope = 10082,
    ArrayLiteral = 17955,
    ObjectLiteral = 17956,
    PrimitiveLiteral = 17925,
    Template = 17958,
    Unary = 39,
    CallScope = 1448,
    CallMember = 1161,
    CallFunction = 1162,
    AccessMember = 9323,
    AccessKeyed = 9324,
    TaggedTemplate = 1197,
    Binary = 46,
    Conditional = 63,
    Assign = 8208,
    ArrowFunction = 17,
    ValueConverter = 36914,
    BindingBehavior = 38963,
    HtmlLiteral = 52,
    ArrayBindingPattern = 65557,
    ObjectBindingPattern = 65558,
    BindingIdentifier = 65559,
    ForOfStatement = 6200,
    Interpolation = 25,
    ArrayDestructuring = 90138,
    ObjectDestructuring = 106523,
    DestructuringAssignmentLeaf = 139292
}
//# sourceMappingURL=ast.kind.d.ts.map