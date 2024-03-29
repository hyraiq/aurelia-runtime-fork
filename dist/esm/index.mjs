import { DI as e, Protocol as t, emptyArray as r, isArrayIndex as n, Registration as i, resolve as o, IPlatform as a } from "@aurelia/kernel";

import { Metadata as c } from "@aurelia/metadata";

const u = Object;

const l = u.prototype.hasOwnProperty;

const h = Reflect.defineProperty;

const createError = e => new Error(e);

const isFunction = e => typeof e === "function";

const isString = e => typeof e === "string";

const isObject = e => e instanceof u;

const isArray = e => e instanceof Array;

const isSet = e => e instanceof Set;

const isMap = e => e instanceof Map;

const f = u.is;

function defineHiddenProp(e, t, r) {
    h(e, t, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: r
    });
    return r;
}

function ensureProto(e, t, r) {
    if (!(t in e)) {
        defineHiddenProp(e, t, r);
    }
}

const p = Object.assign;

const d = Object.freeze;

const w = String;

const b = e.createInterface;

const createLookup = () => u.create(null);

const v = c.getOwn;

c.hasOwn;

const x = c.define;

t.annotation.keyFor;

t.resource.keyFor;

t.resource.appendTo;

const astVisit = (e, t) => {
    switch (e.$kind) {
      case _:
        return t.visitAccessKeyed(e);

      case R:
        return t.visitAccessMember(e);

      case C:
        return t.visitAccessScope(e);

      case E:
        return t.visitAccessThis(e);

      case y:
        return t.visitAccessBoundary(e);

      case U:
        return t.visitArrayBindingPattern(e);

      case W:
        return t.visitDestructuringAssignmentExpression(e);

      case m:
        return t.visitArrayLiteral(e);

      case j:
        return t.visitArrowFunction(e);

      case F:
        return t.visitAssign(e);

      case $:
        return t.visitBinary(e);

      case V:
        return t.visitBindingBehavior(e);

      case K:
        return t.visitBindingIdentifier(e);

      case L:
        return t.visitCallFunction(e);

      case I:
        return t.visitCallMember(e);

      case P:
        return t.visitCallScope(e);

      case D:
        return t.visitConditional(e);

      case J:
        return t.visitDestructuringAssignmentSingleExpression(e);

      case z:
        return t.visitForOfStatement(e);

      case G:
        return t.visitInterpolation(e);

      case H:
        return t.visitObjectBindingPattern(e);

      case q:
        return t.visitDestructuringAssignmentExpression(e);

      case k:
        return t.visitObjectLiteral(e);

      case O:
        return t.visitPrimitiveLiteral(e);

      case B:
        return t.visitTaggedTemplate(e);

      case S:
        return t.visitTemplate(e);

      case T:
        return t.visitUnary(e);

      case N:
        return t.visitValueConverter(e);

      case Q:
        return t.visitCustom(e);

      default:
        {
            throw createError(`Unknown ast node ${JSON.stringify(e)}`);
        }
    }
};

class Unparser {
    constructor() {
        this.text = "";
    }
    static unparse(e) {
        const t = new Unparser;
        astVisit(e, t);
        return t.text;
    }
    visitAccessMember(e) {
        astVisit(e.object, this);
        this.text += `${e.optional ? "?" : ""}.${e.name}`;
    }
    visitAccessKeyed(e) {
        astVisit(e.object, this);
        this.text += `${e.optional ? "?." : ""}[`;
        astVisit(e.key, this);
        this.text += "]";
    }
    visitAccessThis(e) {
        if (e.ancestor === 0) {
            this.text += "$this";
            return;
        }
        this.text += "$parent";
        let t = e.ancestor - 1;
        while (t--) {
            this.text += ".$parent";
        }
    }
    visitAccessBoundary(e) {
        this.text += "this";
    }
    visitAccessScope(e) {
        let t = e.ancestor;
        while (t--) {
            this.text += "$parent.";
        }
        this.text += e.name;
    }
    visitArrayLiteral(e) {
        const t = e.elements;
        this.text += "[";
        for (let e = 0, r = t.length; e < r; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            astVisit(t[e], this);
        }
        this.text += "]";
    }
    visitArrowFunction(e) {
        const t = e.args;
        const r = t.length;
        let n = 0;
        let i = "(";
        let o;
        for (;n < r; ++n) {
            o = t[n].name;
            if (n > 0) {
                i += ", ";
            }
            if (n < r - 1) {
                i += o;
            } else {
                i += e.rest ? `...${o}` : o;
            }
        }
        this.text += `${i}) => `;
        astVisit(e.body, this);
    }
    visitObjectLiteral(e) {
        const t = e.keys;
        const r = e.values;
        this.text += "{";
        for (let e = 0, n = t.length; e < n; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            this.text += `'${t[e]}':`;
            astVisit(r[e], this);
        }
        this.text += "}";
    }
    visitPrimitiveLiteral(e) {
        this.text += "(";
        if (isString(e.value)) {
            const t = e.value.replace(/'/g, "\\'");
            this.text += `'${t}'`;
        } else {
            this.text += `${e.value}`;
        }
        this.text += ")";
    }
    visitCallFunction(e) {
        this.text += "(";
        astVisit(e.func, this);
        this.text += e.optional ? "?." : "";
        this.writeArgs(e.args);
        this.text += ")";
    }
    visitCallMember(e) {
        this.text += "(";
        astVisit(e.object, this);
        this.text += `${e.optionalMember ? "?." : ""}.${e.name}${e.optionalCall ? "?." : ""}`;
        this.writeArgs(e.args);
        this.text += ")";
    }
    visitCallScope(e) {
        this.text += "(";
        let t = e.ancestor;
        while (t--) {
            this.text += "$parent.";
        }
        this.text += `${e.name}${e.optional ? "?." : ""}`;
        this.writeArgs(e.args);
        this.text += ")";
    }
    visitTemplate(e) {
        const {cooked: t, expressions: r} = e;
        const n = r.length;
        this.text += "`";
        this.text += t[0];
        for (let e = 0; e < n; e++) {
            astVisit(r[e], this);
            this.text += t[e + 1];
        }
        this.text += "`";
    }
    visitTaggedTemplate(e) {
        const {cooked: t, expressions: r} = e;
        const n = r.length;
        astVisit(e.func, this);
        this.text += "`";
        this.text += t[0];
        for (let e = 0; e < n; e++) {
            astVisit(r[e], this);
            this.text += t[e + 1];
        }
        this.text += "`";
    }
    visitUnary(e) {
        this.text += `(${e.operation}`;
        if (e.operation.charCodeAt(0) >= 97) {
            this.text += " ";
        }
        astVisit(e.expression, this);
        this.text += ")";
    }
    visitBinary(e) {
        this.text += "(";
        astVisit(e.left, this);
        if (e.operation.charCodeAt(0) === 105) {
            this.text += ` ${e.operation} `;
        } else {
            this.text += e.operation;
        }
        astVisit(e.right, this);
        this.text += ")";
    }
    visitConditional(e) {
        this.text += "(";
        astVisit(e.condition, this);
        this.text += "?";
        astVisit(e.yes, this);
        this.text += ":";
        astVisit(e.no, this);
        this.text += ")";
    }
    visitAssign(e) {
        this.text += "(";
        astVisit(e.target, this);
        this.text += "=";
        astVisit(e.value, this);
        this.text += ")";
    }
    visitValueConverter(e) {
        const t = e.args;
        astVisit(e.expression, this);
        this.text += `|${e.name}`;
        for (let e = 0, r = t.length; e < r; ++e) {
            this.text += ":";
            astVisit(t[e], this);
        }
    }
    visitBindingBehavior(e) {
        const t = e.args;
        astVisit(e.expression, this);
        this.text += `&${e.name}`;
        for (let e = 0, r = t.length; e < r; ++e) {
            this.text += ":";
            astVisit(t[e], this);
        }
    }
    visitArrayBindingPattern(e) {
        const t = e.elements;
        this.text += "[";
        for (let e = 0, r = t.length; e < r; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            astVisit(t[e], this);
        }
        this.text += "]";
    }
    visitObjectBindingPattern(e) {
        const t = e.keys;
        const r = e.values;
        this.text += "{";
        for (let e = 0, n = t.length; e < n; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            this.text += `'${t[e]}':`;
            astVisit(r[e], this);
        }
        this.text += "}";
    }
    visitBindingIdentifier(e) {
        this.text += e.name;
    }
    visitForOfStatement(e) {
        astVisit(e.declaration, this);
        this.text += " of ";
        astVisit(e.iterable, this);
    }
    visitInterpolation(e) {
        const {parts: t, expressions: r} = e;
        const n = r.length;
        this.text += "${";
        this.text += t[0];
        for (let e = 0; e < n; e++) {
            astVisit(r[e], this);
            this.text += t[e + 1];
        }
        this.text += "}";
    }
    visitDestructuringAssignmentExpression(e) {
        const t = e.$kind;
        const r = t === q;
        this.text += r ? "{" : "[";
        const n = e.list;
        const i = n.length;
        let o;
        let a;
        for (o = 0; o < i; o++) {
            a = n[o];
            switch (a.$kind) {
              case J:
                astVisit(a, this);
                break;

              case W:
              case q:
                {
                    const e = a.source;
                    if (e) {
                        astVisit(e, this);
                        this.text += ":";
                    }
                    astVisit(a, this);
                    break;
                }
            }
        }
        this.text += r ? "}" : "]";
    }
    visitDestructuringAssignmentSingleExpression(e) {
        astVisit(e.source, this);
        this.text += ":";
        astVisit(e.target, this);
        const t = e.initializer;
        if (t !== void 0) {
            this.text += "=";
            astVisit(t, this);
        }
    }
    visitDestructuringAssignmentRestExpression(e) {
        this.text += "...";
        astVisit(e.target, this);
    }
    visitCustom(e) {
        this.text += w(e.value);
    }
    writeArgs(e) {
        this.text += "(";
        for (let t = 0, r = e.length; t < r; ++t) {
            if (t !== 0) {
                this.text += ",";
            }
            astVisit(e[t], this);
        }
        this.text += ")";
    }
}

const E = "AccessThis";

const y = "AccessBoundary";

const A = "AccessGlobal";

const C = "AccessScope";

const m = "ArrayLiteral";

const k = "ObjectLiteral";

const O = "PrimitiveLiteral";

const S = "Template";

const T = "Unary";

const P = "CallScope";

const I = "CallMember";

const L = "CallFunction";

const M = "CallGlobal";

const R = "AccessMember";

const _ = "AccessKeyed";

const B = "TaggedTemplate";

const $ = "Binary";

const D = "Conditional";

const F = "Assign";

const j = "ArrowFunction";

const N = "ValueConverter";

const V = "BindingBehavior";

const U = "ArrayBindingPattern";

const H = "ObjectBindingPattern";

const K = "BindingIdentifier";

const z = "ForOfStatement";

const G = "Interpolation";

const W = "ArrayDestructuring";

const q = "ObjectDestructuring";

const J = "DestructuringAssignmentLeaf";

const Q = "Custom";

class CustomExpression {
    constructor(e) {
        this.value = e;
        this.$kind = Q;
    }
    evaluate(e, t, r) {
        return this.value;
    }
    assign(e, t, r) {
        return r;
    }
    bind(e, t) {}
    unbind(e, t) {}
    accept(e) {
        return void 0;
    }
}

class BindingBehaviorExpression {
    constructor(e, t, r) {
        this.expression = e;
        this.name = t;
        this.args = r;
        this.$kind = V;
        this.key = `_bb_${t}`;
    }
}

class ValueConverterExpression {
    constructor(e, t, r) {
        this.expression = e;
        this.name = t;
        this.args = r;
        this.$kind = N;
    }
}

class AssignExpression {
    constructor(e, t) {
        this.target = e;
        this.value = t;
        this.$kind = F;
    }
}

class ConditionalExpression {
    constructor(e, t, r) {
        this.condition = e;
        this.yes = t;
        this.no = r;
        this.$kind = D;
    }
}

class AccessGlobalExpression {
    constructor(e) {
        this.name = e;
        this.$kind = A;
    }
}

class AccessThisExpression {
    constructor(e = 0) {
        this.ancestor = e;
        this.$kind = E;
    }
}

class AccessBoundaryExpression {
    constructor() {
        this.$kind = y;
    }
}

class AccessScopeExpression {
    constructor(e, t = 0) {
        this.name = e;
        this.ancestor = t;
        this.$kind = C;
    }
}

const isAccessGlobal = e => e.$kind === A || (e.$kind === R || e.$kind === _) && e.accessGlobal;

class AccessMemberExpression {
    constructor(e, t, r = false) {
        this.object = e;
        this.name = t;
        this.optional = r;
        this.$kind = R;
        this.accessGlobal = isAccessGlobal(e);
    }
}

class AccessKeyedExpression {
    constructor(e, t, r = false) {
        this.object = e;
        this.key = t;
        this.optional = r;
        this.$kind = _;
        this.accessGlobal = isAccessGlobal(e);
    }
}

class CallScopeExpression {
    constructor(e, t, r = 0, n = false) {
        this.name = e;
        this.args = t;
        this.ancestor = r;
        this.optional = n;
        this.$kind = P;
    }
}

class CallMemberExpression {
    constructor(e, t, r, n = false, i = false) {
        this.object = e;
        this.name = t;
        this.args = r;
        this.optionalMember = n;
        this.optionalCall = i;
        this.$kind = I;
    }
}

class CallFunctionExpression {
    constructor(e, t, r = false) {
        this.func = e;
        this.args = t;
        this.optional = r;
        this.$kind = L;
    }
}

class CallGlobalExpression {
    constructor(e, t) {
        this.name = e;
        this.args = t;
        this.$kind = M;
    }
}

class BinaryExpression {
    constructor(e, t, r) {
        this.operation = e;
        this.left = t;
        this.right = r;
        this.$kind = $;
    }
}

class UnaryExpression {
    constructor(e, t) {
        this.operation = e;
        this.expression = t;
        this.$kind = T;
    }
}

class PrimitiveLiteralExpression {
    constructor(e) {
        this.value = e;
        this.$kind = O;
    }
}

PrimitiveLiteralExpression.$undefined = new PrimitiveLiteralExpression(void 0);

PrimitiveLiteralExpression.$null = new PrimitiveLiteralExpression(null);

PrimitiveLiteralExpression.$true = new PrimitiveLiteralExpression(true);

PrimitiveLiteralExpression.$false = new PrimitiveLiteralExpression(false);

PrimitiveLiteralExpression.$empty = new PrimitiveLiteralExpression("");

class ArrayLiteralExpression {
    constructor(e) {
        this.elements = e;
        this.$kind = m;
    }
}

ArrayLiteralExpression.$empty = new ArrayLiteralExpression(r);

class ObjectLiteralExpression {
    constructor(e, t) {
        this.keys = e;
        this.values = t;
        this.$kind = k;
    }
}

ObjectLiteralExpression.$empty = new ObjectLiteralExpression(r, r);

class TemplateExpression {
    constructor(e, t = r) {
        this.cooked = e;
        this.expressions = t;
        this.$kind = S;
    }
}

TemplateExpression.$empty = new TemplateExpression([ "" ]);

class TaggedTemplateExpression {
    constructor(e, t, n, i = r) {
        this.cooked = e;
        this.func = n;
        this.expressions = i;
        this.$kind = B;
        e.raw = t;
    }
}

class ArrayBindingPattern {
    constructor(e) {
        this.elements = e;
        this.$kind = U;
    }
}

class ObjectBindingPattern {
    constructor(e, t) {
        this.keys = e;
        this.values = t;
        this.$kind = H;
    }
}

class BindingIdentifier {
    constructor(e) {
        this.name = e;
        this.$kind = K;
    }
}

class ForOfStatement {
    constructor(e, t, r) {
        this.declaration = e;
        this.iterable = t;
        this.semiIdx = r;
        this.$kind = z;
    }
}

class Interpolation {
    constructor(e, t = r) {
        this.parts = e;
        this.expressions = t;
        this.$kind = G;
        this.isMulti = t.length > 1;
        this.firstExpression = t[0];
    }
}

class DestructuringAssignmentExpression {
    constructor(e, t, r, n) {
        this.$kind = e;
        this.list = t;
        this.source = r;
        this.initializer = n;
    }
}

class DestructuringAssignmentSingleExpression {
    constructor(e, t, r) {
        this.target = e;
        this.source = t;
        this.initializer = r;
        this.$kind = J;
    }
}

class DestructuringAssignmentRestExpression {
    constructor(e, t) {
        this.target = e;
        this.indexOrProperties = t;
        this.$kind = J;
    }
}

class ArrowFunction {
    constructor(e, t, r = false) {
        this.args = e;
        this.body = t;
        this.rest = r;
        this.$kind = j;
    }
}

const createMappedError = (e, ...t) => new Error(`AUR${w(e).padStart(4, "0")}:${t.map(w)}`);

class BindingContext {
    constructor(e, t) {
        if (e !== void 0) {
            this[e] = t;
        }
    }
}

class Scope {
    constructor(e, t, r, n) {
        this.parent = e;
        this.bindingContext = t;
        this.overrideContext = r;
        this.isBoundary = n;
    }
    static getContext(e, t, r) {
        if (e == null) {
            throw createMappedError(203);
        }
        let n = e.overrideContext;
        let i = e;
        if (r > 0) {
            while (r > 0) {
                r--;
                i = i.parent;
                if (i == null) {
                    return void 0;
                }
            }
            n = i.overrideContext;
            return t in n ? n : i.bindingContext;
        }
        while (i != null && !i.isBoundary && !(t in i.overrideContext) && !(t in i.bindingContext)) {
            i = i.parent;
        }
        if (i == null) {
            return e.bindingContext;
        }
        n = i.overrideContext;
        return t in n ? n : i.bindingContext;
    }
    static create(e, t, r) {
        if (e == null) {
            throw createMappedError(204);
        }
        return new Scope(null, e, t ?? new OverrideContext, r ?? false);
    }
    static fromParent(e, t) {
        if (e == null) {
            throw createMappedError(203);
        }
        return new Scope(e, t, new OverrideContext, false);
    }
}

class OverrideContext {}

const X = Scope.getContext;

function astEvaluate(e, t, r, n) {
    switch (e.$kind) {
      case E:
        {
            let r = t.overrideContext;
            let n = t;
            let i = e.ancestor;
            while (i-- && r) {
                n = n.parent;
                r = n?.overrideContext ?? null;
            }
            return i < 1 && n ? n.bindingContext : void 0;
        }

      case y:
        {
            let e = t;
            while (e != null && !e.isBoundary) {
                e = e.parent;
            }
            return e ? e.bindingContext : void 0;
        }

      case C:
        {
            const i = X(t, e.name, e.ancestor);
            if (n !== null) {
                n.observe(i, e.name);
            }
            const o = i[e.name];
            if (o == null && e.name === "$host") {
                throw createMappedError(105);
            }
            if (r?.strict) {
                return r?.boundFn && isFunction(o) ? o.bind(i) : o;
            }
            return o == null ? "" : r?.boundFn && isFunction(o) ? o.bind(i) : o;
        }

      case A:
        return globalThis[e.name];

      case M:
        {
            const i = globalThis[e.name];
            if (isFunction(i)) {
                return i(...e.args.map((e => astEvaluate(e, t, r, n))));
            }
            if (!r?.strictFnCall && i == null) {
                return void 0;
            }
            throw createMappedError(107);
        }

      case m:
        return e.elements.map((e => astEvaluate(e, t, r, n)));

      case k:
        {
            const i = {};
            for (let o = 0; o < e.keys.length; ++o) {
                i[e.keys[o]] = astEvaluate(e.values[o], t, r, n);
            }
            return i;
        }

      case O:
        return e.value;

      case S:
        {
            let i = e.cooked[0];
            for (let o = 0; o < e.expressions.length; ++o) {
                i += String(astEvaluate(e.expressions[o], t, r, n));
                i += e.cooked[o + 1];
            }
            return i;
        }

      case T:
        switch (e.operation) {
          case "void":
            return void astEvaluate(e.expression, t, r, n);

          case "typeof":
            return typeof astEvaluate(e.expression, t, r, n);

          case "!":
            return !astEvaluate(e.expression, t, r, n);

          case "-":
            return -astEvaluate(e.expression, t, r, n);

          case "+":
            return +astEvaluate(e.expression, t, r, n);

          default:
            throw createMappedError(109, e.operation);
        }

      case P:
        {
            const i = e.args.map((e => astEvaluate(e, t, r, n)));
            const o = X(t, e.name, e.ancestor);
            const a = getFunction(r?.strictFnCall, o, e.name);
            if (a) {
                return a.apply(o, i);
            }
            return void 0;
        }

      case I:
        {
            const i = astEvaluate(e.object, t, r, n);
            const o = e.args.map((e => astEvaluate(e, t, r, n)));
            const a = getFunction(r?.strictFnCall, i, e.name);
            let c;
            if (a) {
                c = a.apply(i, o);
                if (isArray(i) && Y.includes(e.name)) {
                    n?.observeCollection(i);
                }
            }
            return c;
        }

      case L:
        {
            const i = astEvaluate(e.func, t, r, n);
            if (isFunction(i)) {
                return i(...e.args.map((e => astEvaluate(e, t, r, n))));
            }
            if (!r?.strictFnCall && i == null) {
                return void 0;
            }
            throw createMappedError(107);
        }

      case j:
        {
            const func = (...i) => {
                const o = e.args;
                const a = e.rest;
                const c = o.length - 1;
                const u = o.reduce(((e, t, r) => {
                    if (a && r === c) {
                        e[t.name] = i.slice(r);
                    } else {
                        e[t.name] = i[r];
                    }
                    return e;
                }), {});
                const l = Scope.fromParent(t, u);
                return astEvaluate(e.body, l, r, n);
            };
            return func;
        }

      case R:
        {
            const i = astEvaluate(e.object, t, r, n);
            let o;
            if (r?.strict) {
                if (i == null) {
                    return undefined;
                }
                if (n !== null && !e.accessGlobal) {
                    n.observe(i, e.name);
                }
                o = i[e.name];
                if (r?.boundFn && isFunction(o)) {
                    return o.bind(i);
                }
                return o;
            }
            if (n !== null && isObject(i) && !e.accessGlobal) {
                n.observe(i, e.name);
            }
            if (i) {
                o = i[e.name];
                if (r?.boundFn && isFunction(o)) {
                    return o.bind(i);
                }
                return o;
            }
            return "";
        }

      case _:
        {
            const i = astEvaluate(e.object, t, r, n);
            const o = astEvaluate(e.key, t, r, n);
            if (isObject(i)) {
                if (n !== null && !e.accessGlobal) {
                    n.observe(i, o);
                }
                return i[o];
            }
            return i == null ? void 0 : i[o];
        }

      case B:
        {
            const i = e.expressions.map((e => astEvaluate(e, t, r, n)));
            const o = astEvaluate(e.func, t, r, n);
            if (!isFunction(o)) {
                throw createMappedError(110);
            }
            return o(e.cooked, ...i);
        }

      case $:
        {
            const i = e.left;
            const o = e.right;
            switch (e.operation) {
              case "&&":
                return astEvaluate(i, t, r, n) && astEvaluate(o, t, r, n);

              case "||":
                return astEvaluate(i, t, r, n) || astEvaluate(o, t, r, n);

              case "??":
                return astEvaluate(i, t, r, n) ?? astEvaluate(o, t, r, n);

              case "==":
                return astEvaluate(i, t, r, n) == astEvaluate(o, t, r, n);

              case "===":
                return astEvaluate(i, t, r, n) === astEvaluate(o, t, r, n);

              case "!=":
                return astEvaluate(i, t, r, n) != astEvaluate(o, t, r, n);

              case "!==":
                return astEvaluate(i, t, r, n) !== astEvaluate(o, t, r, n);

              case "instanceof":
                {
                    const e = astEvaluate(o, t, r, n);
                    if (isFunction(e)) {
                        return astEvaluate(i, t, r, n) instanceof e;
                    }
                    return false;
                }

              case "in":
                {
                    const e = astEvaluate(o, t, r, n);
                    if (isObject(e)) {
                        return astEvaluate(i, t, r, n) in e;
                    }
                    return false;
                }

              case "+":
                {
                    const e = astEvaluate(i, t, r, n);
                    const a = astEvaluate(o, t, r, n);
                    if (r?.strict) {
                        return e + a;
                    }
                    if (!e || !a) {
                        if (isNumberOrBigInt(e) || isNumberOrBigInt(a)) {
                            return (e || 0) + (a || 0);
                        }
                        if (isStringOrDate(e) || isStringOrDate(a)) {
                            return (e || "") + (a || "");
                        }
                    }
                    return e + a;
                }

              case "-":
                return astEvaluate(i, t, r, n) - astEvaluate(o, t, r, n);

              case "*":
                return astEvaluate(i, t, r, n) * astEvaluate(o, t, r, n);

              case "/":
                return astEvaluate(i, t, r, n) / astEvaluate(o, t, r, n);

              case "%":
                return astEvaluate(i, t, r, n) % astEvaluate(o, t, r, n);

              case "<":
                return astEvaluate(i, t, r, n) < astEvaluate(o, t, r, n);

              case ">":
                return astEvaluate(i, t, r, n) > astEvaluate(o, t, r, n);

              case "<=":
                return astEvaluate(i, t, r, n) <= astEvaluate(o, t, r, n);

              case ">=":
                return astEvaluate(i, t, r, n) >= astEvaluate(o, t, r, n);

              default:
                throw createMappedError(108, e.operation);
            }
        }

      case D:
        return astEvaluate(e.condition, t, r, n) ? astEvaluate(e.yes, t, r, n) : astEvaluate(e.no, t, r, n);

      case F:
        return astAssign(e.target, t, r, astEvaluate(e.value, t, r, n));

      case N:
        {
            const i = r?.getConverter?.(e.name);
            if (i == null) {
                throw createMappedError(103, e.name);
            }
            if ("toView" in i) {
                return i.toView(astEvaluate(e.expression, t, r, n), ...e.args.map((e => astEvaluate(e, t, r, n))));
            }
            return astEvaluate(e.expression, t, r, n);
        }

      case V:
        return astEvaluate(e.expression, t, r, n);

      case K:
        return e.name;

      case z:
        return astEvaluate(e.iterable, t, r, n);

      case G:
        if (e.isMulti) {
            let i = e.parts[0];
            let o = 0;
            for (;o < e.expressions.length; ++o) {
                i += w(astEvaluate(e.expressions[o], t, r, n));
                i += e.parts[o + 1];
            }
            return i;
        } else {
            return `${e.parts[0]}${astEvaluate(e.firstExpression, t, r, n)}${e.parts[1]}`;
        }

      case J:
        return astEvaluate(e.target, t, r, n);

      case W:
        {
            return e.list.map((e => astEvaluate(e, t, r, n)));
        }

      case U:
      case H:
      case q:
      default:
        return void 0;

      case Q:
        return e.evaluate(t, r, n);
    }
}

function astAssign(e, t, r, i) {
    switch (e.$kind) {
      case C:
        {
            if (e.name === "$host") {
                throw createMappedError(106);
            }
            const r = X(t, e.name, e.ancestor);
            return r[e.name] = i;
        }

      case R:
        {
            const n = astEvaluate(e.object, t, r, null);
            if (isObject(n)) {
                if (e.name === "length" && isArray(n) && !isNaN(i)) {
                    n.splice(i);
                } else {
                    n[e.name] = i;
                }
            } else {
                astAssign(e.object, t, r, {
                    [e.name]: i
                });
            }
            return i;
        }

      case _:
        {
            const o = astEvaluate(e.object, t, r, null);
            const a = astEvaluate(e.key, t, r, null);
            if (isArray(o)) {
                if (a === "length" && !isNaN(i)) {
                    o.splice(i);
                    return i;
                }
                if (n(a)) {
                    o.splice(a, 1, i);
                    return i;
                }
            }
            return o[a] = i;
        }

      case F:
        astAssign(e.value, t, r, i);
        return astAssign(e.target, t, r, i);

      case N:
        {
            const n = r?.getConverter?.(e.name);
            if (n == null) {
                throw createMappedError(103, e.name);
            }
            if ("fromView" in n) {
                i = n.fromView(i, ...e.args.map((e => astEvaluate(e, t, r, null))));
            }
            return astAssign(e.expression, t, r, i);
        }

      case V:
        return astAssign(e.expression, t, r, i);

      case W:
      case q:
        {
            const n = e.list;
            const o = n.length;
            let a;
            let c;
            for (a = 0; a < o; a++) {
                c = n[a];
                switch (c.$kind) {
                  case J:
                    astAssign(c, t, r, i);
                    break;

                  case W:
                  case q:
                    {
                        if (typeof i !== "object" || i === null) {
                            throw createMappedError(112);
                        }
                        let e = astEvaluate(c.source, Scope.create(i), r, null);
                        if (e === void 0 && c.initializer) {
                            e = astEvaluate(c.initializer, t, r, null);
                        }
                        astAssign(c, t, r, e);
                        break;
                    }
                }
            }
            break;
        }

      case J:
        {
            if (e instanceof DestructuringAssignmentSingleExpression) {
                if (i == null) {
                    return;
                }
                if (typeof i !== "object") {
                    throw createMappedError(112);
                }
                let n = astEvaluate(e.source, Scope.create(i), r, null);
                if (n === void 0 && e.initializer) {
                    n = astEvaluate(e.initializer, t, r, null);
                }
                astAssign(e.target, t, r, n);
            } else {
                if (i == null) {
                    return;
                }
                if (typeof i !== "object") {
                    throw createMappedError(112);
                }
                const o = e.indexOrProperties;
                let a;
                if (n(o)) {
                    if (!Array.isArray(i)) {
                        throw createMappedError(112);
                    }
                    a = i.slice(o);
                } else {
                    a = Object.entries(i).reduce(((e, [t, r]) => {
                        if (!o.includes(t)) {
                            e[t] = r;
                        }
                        return e;
                    }), {});
                }
                astAssign(e.target, t, r, a);
            }
            break;
        }

      case Q:
        return e.assign(t, r, i);

      default:
        return void 0;
    }
}

function astBind(e, t, r) {
    switch (e.$kind) {
      case V:
        {
            const n = e.name;
            const i = e.key;
            const o = r.getBehavior?.(n);
            if (o == null) {
                throw createMappedError(101, n);
            }
            if (r[i] === void 0) {
                r[i] = o;
                o.bind?.(t, r, ...e.args.map((e => astEvaluate(e, t, r, null))));
            } else {
                throw createMappedError(102, n);
            }
            astBind(e.expression, t, r);
            return;
        }

      case N:
        {
            const n = e.name;
            const i = r.getConverter?.(n);
            if (i == null) {
                throw createMappedError(103, n);
            }
            const o = i.signals;
            if (o != null) {
                const e = r.getSignaler?.();
                const t = o.length;
                let n = 0;
                for (;n < t; ++n) {
                    e?.addSignalListener(o[n], r);
                }
            }
            astBind(e.expression, t, r);
            return;
        }

      case z:
        {
            astBind(e.iterable, t, r);
            break;
        }

      case Q:
        {
            e.bind?.(t, r);
        }
    }
}

function astUnbind(e, t, r) {
    switch (e.$kind) {
      case V:
        {
            const n = e.key;
            const i = r;
            if (i[n] !== void 0) {
                i[n].unbind?.(t, r);
                i[n] = void 0;
            }
            astUnbind(e.expression, t, r);
            break;
        }

      case N:
        {
            const n = r.getConverter?.(e.name);
            if (n?.signals === void 0) {
                return;
            }
            const i = r.getSignaler?.();
            let o = 0;
            for (;o < n.signals.length; ++o) {
                i?.removeSignalListener(n.signals[o], r);
            }
            astUnbind(e.expression, t, r);
            break;
        }

      case z:
        {
            astUnbind(e.iterable, t, r);
            break;
        }

      case Q:
        {
            e.unbind?.(t, r);
        }
    }
}

const getFunction = (e, t, r) => {
    const n = t == null ? null : t[r];
    if (isFunction(n)) {
        return n;
    }
    if (!e && n == null) {
        return null;
    }
    throw createMappedError(111, r);
};

const isNumberOrBigInt = e => {
    switch (typeof e) {
      case "number":
      case "bigint":
        return true;

      default:
        return false;
    }
};

const isStringOrDate = e => {
    switch (typeof e) {
      case "string":
        return true;

      case "object":
        return e instanceof Date;

      default:
        return false;
    }
};

const Y = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

const Z = /*@__PURE__*/ e.createInterface("ICoercionConfiguration");

const ee = 0;

const te = 1;

const se = 2;

const re = 4;

const ne = /*@__PURE__*/ d({
    None: ee,
    Observer: te,
    Node: se,
    Layout: re
});

function copyIndexMap(e, t, r) {
    const {length: n} = e;
    const i = Array(n);
    let o = 0;
    while (o < n) {
        i[o] = e[o];
        ++o;
    }
    if (t !== void 0) {
        i.deletedIndices = t.slice(0);
    } else if (e.deletedIndices !== void 0) {
        i.deletedIndices = e.deletedIndices.slice(0);
    } else {
        i.deletedIndices = [];
    }
    if (r !== void 0) {
        i.deletedItems = r.slice(0);
    } else if (e.deletedItems !== void 0) {
        i.deletedItems = e.deletedItems.slice(0);
    } else {
        i.deletedItems = [];
    }
    i.isIndexMap = true;
    return i;
}

function createIndexMap(e = 0) {
    const t = Array(e);
    let r = 0;
    while (r < e) {
        t[r] = r++;
    }
    t.deletedIndices = [];
    t.deletedItems = [];
    t.isIndexMap = true;
    return t;
}

function cloneIndexMap(e) {
    const t = e.slice();
    t.deletedIndices = e.deletedIndices.slice();
    t.deletedItems = e.deletedItems.slice();
    t.isIndexMap = true;
    return t;
}

function isIndexMap(e) {
    return isArray(e) && e.isIndexMap === true;
}

let ie = new Map;

let oe = false;

function batch(e) {
    const t = ie;
    const r = ie = new Map;
    oe = true;
    try {
        e();
    } finally {
        ie = null;
        oe = false;
        try {
            let e;
            let n;
            let i;
            let o;
            let a;
            let c = false;
            let u;
            let l;
            for (e of r) {
                n = e[0];
                i = e[1];
                if (t?.has(n)) {
                    t.set(n, i);
                }
                if (i[0] === 1) {
                    n.notify(i[1], i[2]);
                } else {
                    o = i[1];
                    a = i[2];
                    c = false;
                    if (a.deletedIndices.length > 0) {
                        c = true;
                    } else {
                        for (u = 0, l = a.length; u < l; ++u) {
                            if (a[u] !== u) {
                                c = true;
                                break;
                            }
                        }
                    }
                    if (c) {
                        n.notifyCollection(o, a);
                    }
                }
            }
        } finally {
            ie = t;
        }
    }
}

function addCollectionBatch(e, t, r) {
    if (!ie.has(e)) {
        ie.set(e, [ 2, t, r ]);
    } else {
        ie.get(e)[2] = r;
    }
}

function addValueBatch(e, t, r) {
    const n = ie.get(e);
    if (n === void 0) {
        ie.set(e, [ 1, t, r ]);
    } else {
        n[1] = t;
        n[2] = r;
    }
}

function subscriberCollection(e) {
    return e == null ? subscriberCollectionDeco : subscriberCollectionDeco(e);
}

const ae = new WeakSet;

function subscriberCollectionDeco(e) {
    if (ae.has(e)) {
        return;
    }
    ae.add(e);
    const t = e.prototype;
    h(t, "subs", {
        get: getSubscriberRecord
    });
    ensureProto(t, "subscribe", addSubscriber);
    ensureProto(t, "unsubscribe", removeSubscriber);
}

class SubscriberRecord {
    constructor() {
        this.count = 0;
        this.t = [];
    }
    add(e) {
        if (this.t.includes(e)) {
            return false;
        }
        this.t[this.t.length] = e;
        ++this.count;
        return true;
    }
    remove(e) {
        const t = this.t.indexOf(e);
        if (t !== -1) {
            this.t.splice(t, 1);
            --this.count;
            return true;
        }
        return false;
    }
    notify(e, t) {
        if (oe) {
            addValueBatch(this, e, t);
            return;
        }
        const r = this.t.slice(0);
        const n = r.length;
        let i = 0;
        for (;i < n; ++i) {
            r[i].handleChange(e, t);
        }
        return;
    }
    notifyCollection(e, t) {
        const r = this.t.slice(0);
        const n = r.length;
        let i = 0;
        for (;i < n; ++i) {
            r[i].handleCollectionChange(e, t);
        }
        return;
    }
}

function getSubscriberRecord() {
    return defineHiddenProp(this, "subs", new SubscriberRecord);
}

function addSubscriber(e) {
    return this.subs.add(e);
}

function removeSubscriber(e) {
    return this.subs.remove(e);
}

class CollectionLengthObserver {
    constructor(e) {
        this.owner = e;
        this.type = te;
        this.v = (this.o = e.collection).length;
    }
    getValue() {
        return this.o.length;
    }
    setValue(e) {
        if (e !== this.v) {
            if (!Number.isNaN(e)) {
                this.o.splice(e);
                this.v = this.o.length;
            }
        }
    }
    handleCollectionChange(e, t) {
        const r = this.v;
        const n = this.o.length;
        if ((this.v = n) !== r) {
            this.subs.notify(this.v, r);
        }
    }
}

class CollectionSizeObserver {
    constructor(e) {
        this.owner = e;
        this.type = te;
        this.v = (this.o = e.collection).size;
    }
    getValue() {
        return this.o.size;
    }
    setValue() {
        throw createMappedError(220);
    }
    handleCollectionChange(e, t) {
        const r = this.v;
        const n = this.o.size;
        if ((this.v = n) !== r) {
            this.subs.notify(this.v, r);
        }
    }
}

function implementLengthObserver(e) {
    const t = e.prototype;
    ensureProto(t, "subscribe", subscribe);
    ensureProto(t, "unsubscribe", unsubscribe);
    subscriberCollection(e);
}

function subscribe(e) {
    if (this.subs.add(e) && this.subs.count === 1) {
        this.owner.subscribe(this);
    }
}

function unsubscribe(e) {
    if (this.subs.remove(e) && this.subs.count === 0) {
        this.owner.subscribe(this);
    }
}

implementLengthObserver(CollectionLengthObserver);

implementLengthObserver(CollectionSizeObserver);

const ce = Symbol.for("__au_arr_obs__");

const ue = Array[ce] ?? defineHiddenProp(Array, ce, new WeakMap);

function sortCompare(e, t) {
    if (e === t) {
        return 0;
    }
    e = e === null ? "null" : e.toString();
    t = t === null ? "null" : t.toString();
    return e < t ? -1 : 1;
}

function preSortCompare(e, t) {
    if (e === void 0) {
        if (t === void 0) {
            return 0;
        } else {
            return 1;
        }
    }
    if (t === void 0) {
        return -1;
    }
    return 0;
}

function insertionSort(e, t, r, n, i) {
    let o, a, c, u, l;
    let h, f;
    for (h = r + 1; h < n; h++) {
        o = e[h];
        a = t[h];
        for (f = h - 1; f >= r; f--) {
            c = e[f];
            u = t[f];
            l = i(c, o);
            if (l > 0) {
                e[f + 1] = c;
                t[f + 1] = u;
            } else {
                break;
            }
        }
        e[f + 1] = o;
        t[f + 1] = a;
    }
}

function quickSort(e, t, r, n, i) {
    let o = 0, a = 0;
    let c, u, l;
    let h, f, p;
    let d, w, b;
    let v, x;
    let E, y, A, C;
    let m, k, O, S;
    while (true) {
        if (n - r <= 10) {
            insertionSort(e, t, r, n, i);
            return;
        }
        o = r + (n - r >> 1);
        c = e[r];
        h = t[r];
        u = e[n - 1];
        f = t[n - 1];
        l = e[o];
        p = t[o];
        d = i(c, u);
        if (d > 0) {
            v = c;
            x = h;
            c = u;
            h = f;
            u = v;
            f = x;
        }
        w = i(c, l);
        if (w >= 0) {
            v = c;
            x = h;
            c = l;
            h = p;
            l = u;
            p = f;
            u = v;
            f = x;
        } else {
            b = i(u, l);
            if (b > 0) {
                v = u;
                x = f;
                u = l;
                f = p;
                l = v;
                p = x;
            }
        }
        e[r] = c;
        t[r] = h;
        e[n - 1] = l;
        t[n - 1] = p;
        E = u;
        y = f;
        A = r + 1;
        C = n - 1;
        e[o] = e[A];
        t[o] = t[A];
        e[A] = E;
        t[A] = y;
        e: for (a = A + 1; a < C; a++) {
            m = e[a];
            k = t[a];
            O = i(m, E);
            if (O < 0) {
                e[a] = e[A];
                t[a] = t[A];
                e[A] = m;
                t[A] = k;
                A++;
            } else if (O > 0) {
                do {
                    C--;
                    if (C == a) {
                        break e;
                    }
                    S = e[C];
                    O = i(S, E);
                } while (O > 0);
                e[a] = e[C];
                t[a] = t[C];
                e[C] = m;
                t[C] = k;
                if (O < 0) {
                    m = e[a];
                    k = t[a];
                    e[a] = e[A];
                    t[a] = t[A];
                    e[A] = m;
                    t[A] = k;
                    A++;
                }
            }
        }
        if (n - C < A - r) {
            quickSort(e, t, C, n, i);
            n = A;
        } else {
            quickSort(e, t, r, A, i);
            r = C;
        }
    }
}

const le = Array.prototype;

const he = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

let fe;

let pe;

function overrideArrayPrototypes() {
    const e = le.push;
    const t = le.unshift;
    const r = le.pop;
    const n = le.shift;
    const i = le.splice;
    const o = le.reverse;
    const a = le.sort;
    pe = {
        push: e,
        unshift: t,
        pop: r,
        shift: n,
        splice: i,
        reverse: o,
        sort: a
    };
    fe = {
        push: function(...t) {
            const r = ue.get(this);
            if (r === void 0) {
                return e.apply(this, t);
            }
            const n = this.length;
            const i = t.length;
            if (i === 0) {
                return n;
            }
            this.length = r.indexMap.length = n + i;
            let o = n;
            while (o < this.length) {
                this[o] = t[o - n];
                r.indexMap[o] = -2;
                o++;
            }
            r.notify();
            return this.length;
        },
        unshift: function(...e) {
            const r = ue.get(this);
            if (r === void 0) {
                return t.apply(this, e);
            }
            const n = e.length;
            const i = new Array(n);
            let o = 0;
            while (o < n) {
                i[o++] = -2;
            }
            t.apply(r.indexMap, i);
            const a = t.apply(this, e);
            r.notify();
            return a;
        },
        pop: function() {
            const e = ue.get(this);
            if (e === void 0) {
                return r.call(this);
            }
            const t = e.indexMap;
            const n = r.call(this);
            const i = t.length - 1;
            if (t[i] > -1) {
                t.deletedIndices.push(t[i]);
                t.deletedItems.push(n);
            }
            r.call(t);
            e.notify();
            return n;
        },
        shift: function() {
            const e = ue.get(this);
            if (e === void 0) {
                return n.call(this);
            }
            const t = e.indexMap;
            const r = n.call(this);
            if (t[0] > -1) {
                t.deletedIndices.push(t[0]);
                t.deletedItems.push(r);
            }
            n.call(t);
            e.notify();
            return r;
        },
        splice: function(...e) {
            const t = e[0];
            const r = e[1];
            const n = ue.get(this);
            if (n === void 0) {
                return i.apply(this, e);
            }
            const o = this.length;
            const a = t | 0;
            const c = a < 0 ? Math.max(o + a, 0) : Math.min(a, o);
            const u = n.indexMap;
            const l = e.length;
            const h = l === 0 ? 0 : l === 1 ? o - c : r;
            let f = c;
            if (h > 0) {
                const e = f + h;
                while (f < e) {
                    if (u[f] > -1) {
                        u.deletedIndices.push(u[f]);
                        u.deletedItems.push(this[f]);
                    }
                    f++;
                }
            }
            f = 0;
            if (l > 2) {
                const e = l - 2;
                const n = new Array(e);
                while (f < e) {
                    n[f++] = -2;
                }
                i.call(u, t, r, ...n);
            } else {
                i.apply(u, e);
            }
            const p = i.apply(this, e);
            if (h > 0 || f > 0) {
                n.notify();
            }
            return p;
        },
        reverse: function() {
            const e = ue.get(this);
            if (e === void 0) {
                o.call(this);
                return this;
            }
            const t = this.length;
            const r = t / 2 | 0;
            let n = 0;
            while (n !== r) {
                const r = t - n - 1;
                const i = this[n];
                const o = e.indexMap[n];
                const a = this[r];
                const c = e.indexMap[r];
                this[n] = a;
                e.indexMap[n] = c;
                this[r] = i;
                e.indexMap[r] = o;
                n++;
            }
            e.notify();
            return this;
        },
        sort: function(e) {
            const t = ue.get(this);
            if (t === void 0) {
                a.call(this, e);
                return this;
            }
            let r = this.length;
            if (r < 2) {
                return this;
            }
            quickSort(this, t.indexMap, 0, r, preSortCompare);
            let n = 0;
            while (n < r) {
                if (this[n] === void 0) {
                    break;
                }
                n++;
            }
            if (e === void 0 || !isFunction(e)) {
                e = sortCompare;
            }
            quickSort(this, t.indexMap, 0, n, e);
            let i = false;
            for (n = 0, r = t.indexMap.length; r > n; ++n) {
                if (t.indexMap[n] !== n) {
                    i = true;
                    break;
                }
            }
            if (i || oe) {
                t.notify();
            }
            return this;
        }
    };
    for (const e of he) {
        h(fe[e], "observing", {
            value: true,
            writable: false,
            configurable: false,
            enumerable: false
        });
    }
}

let de = false;

const we = "__au_arr_on__";

function enableArrayObservation() {
    if (fe === undefined) {
        overrideArrayPrototypes();
    }
    if (!(v(we, Array) ?? false)) {
        x(we, true, Array);
        for (const e of he) {
            if (le[e].observing !== true) {
                defineHiddenProp(le, e, fe[e]);
            }
        }
    }
}

function disableArrayObservation() {
    for (const e of he) {
        if (le[e].observing === true) {
            defineHiddenProp(le, e, pe[e]);
        }
    }
}

class ArrayObserver {
    constructor(e) {
        this.type = te;
        if (!de) {
            de = true;
            enableArrayObservation();
        }
        this.indexObservers = {};
        this.collection = e;
        this.indexMap = createIndexMap(e.length);
        this.lenObs = void 0;
        ue.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (oe) {
            addCollectionBatch(e, this.collection, t);
            return;
        }
        const r = this.collection;
        const n = r.length;
        this.indexMap = createIndexMap(n);
        this.subs.notifyCollection(r, t);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionLengthObserver(this));
    }
    getIndexObserver(e) {
        var t;
        return (t = this.indexObservers)[e] ?? (t[e] = new ArrayIndexObserver(this, e));
    }
}

class ArrayIndexObserver {
    constructor(e, t) {
        this.owner = e;
        this.index = t;
        this.doNotCache = true;
        this.value = this.getValue();
    }
    getValue() {
        return this.owner.collection[this.index];
    }
    setValue(e) {
        if (e === this.getValue()) {
            return;
        }
        const t = this.owner;
        const r = this.index;
        const n = t.indexMap;
        if (n[r] > -1) {
            n.deletedIndices.push(n[r]);
        }
        n[r] = -2;
        t.collection[r] = e;
        t.notify();
    }
    handleCollectionChange(e, t) {
        const r = this.index;
        const n = t[r] === r;
        if (n) {
            return;
        }
        const i = this.value;
        const o = this.value = this.getValue();
        if (i !== o) {
            this.subs.notify(o, i);
        }
    }
    subscribe(e) {
        if (this.subs.add(e) && this.subs.count === 1) {
            this.owner.subscribe(this);
        }
    }
    unsubscribe(e) {
        if (this.subs.remove(e) && this.subs.count === 0) {
            this.owner.unsubscribe(this);
        }
    }
}

subscriberCollection(ArrayObserver);

subscriberCollection(ArrayIndexObserver);

function getArrayObserver(e) {
    let t = ue.get(e);
    if (t === void 0) {
        t = new ArrayObserver(e);
    }
    return t;
}

const be = Symbol.for("__au_set_obs__");

const ve = Set[be] ?? defineHiddenProp(Set, be, new WeakMap);

const ge = Set.prototype;

const xe = ge.add;

const Ee = ge.clear;

const ye = ge.delete;

const Ae = {
    add: xe,
    clear: Ee,
    delete: ye
};

const Ce = [ "add", "clear", "delete" ];

const me = {
    add: function(e) {
        const t = ve.get(this);
        if (t === undefined) {
            xe.call(this, e);
            return this;
        }
        const r = this.size;
        xe.call(this, e);
        const n = this.size;
        if (n === r) {
            return this;
        }
        t.indexMap[r] = -2;
        t.notify();
        return this;
    },
    clear: function() {
        const e = ve.get(this);
        if (e === undefined) {
            return Ee.call(this);
        }
        const t = this.size;
        if (t > 0) {
            const t = e.indexMap;
            let r = 0;
            for (const e of this.keys()) {
                if (t[r] > -1) {
                    t.deletedIndices.push(t[r]);
                    t.deletedItems.push(e);
                }
                r++;
            }
            Ee.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = ve.get(this);
        if (t === undefined) {
            return ye.call(this, e);
        }
        const r = this.size;
        if (r === 0) {
            return false;
        }
        let n = 0;
        const i = t.indexMap;
        for (const r of this.keys()) {
            if (r === e) {
                if (i[n] > -1) {
                    i.deletedIndices.push(i[n]);
                    i.deletedItems.push(r);
                }
                i.splice(n, 1);
                const o = ye.call(this, e);
                if (o === true) {
                    t.notify();
                }
                return o;
            }
            n++;
        }
        return false;
    }
};

const ke = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of Ce) {
    h(me[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let Oe = false;

const Se = "__au_set_on__";

function enableSetObservation() {
    if (!(v(Se, Set) ?? false)) {
        x(Se, true, Set);
        for (const e of Ce) {
            if (ge[e].observing !== true) {
                h(ge, e, {
                    ...ke,
                    value: me[e]
                });
            }
        }
    }
}

function disableSetObservation() {
    for (const e of Ce) {
        if (ge[e].observing === true) {
            h(ge, e, {
                ...ke,
                value: Ae[e]
            });
        }
    }
}

class SetObserver {
    constructor(e) {
        this.type = te;
        if (!Oe) {
            Oe = true;
            enableSetObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        ve.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (oe) {
            addCollectionBatch(e, this.collection, t);
            return;
        }
        const r = this.collection;
        const n = r.size;
        this.indexMap = createIndexMap(n);
        this.subs.notifyCollection(r, t);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

subscriberCollection(SetObserver);

function getSetObserver(e) {
    let t = ve.get(e);
    if (t === void 0) {
        t = new SetObserver(e);
    }
    return t;
}

const Te = Symbol.for("__au_map_obs__");

const Pe = Map[Te] ?? defineHiddenProp(Map, Te, new WeakMap);

const Ie = Map.prototype;

const Le = Ie.set;

const Me = Ie.clear;

const Re = Ie.delete;

const _e = {
    set: Le,
    clear: Me,
    delete: Re
};

const Be = [ "set", "clear", "delete" ];

const $e = {
    set: function(e, t) {
        const r = Pe.get(this);
        if (r === undefined) {
            Le.call(this, e, t);
            return this;
        }
        const n = this.get(e);
        const i = this.size;
        Le.call(this, e, t);
        const o = this.size;
        if (o === i) {
            let t = 0;
            for (const i of this.entries()) {
                if (i[0] === e) {
                    if (i[1] !== n) {
                        r.indexMap.deletedIndices.push(r.indexMap[t]);
                        r.indexMap.deletedItems.push(i);
                        r.indexMap[t] = -2;
                        r.notify();
                    }
                    return this;
                }
                t++;
            }
            return this;
        }
        r.indexMap[i] = -2;
        r.notify();
        return this;
    },
    clear: function() {
        const e = Pe.get(this);
        if (e === undefined) {
            return Me.call(this);
        }
        const t = this.size;
        if (t > 0) {
            const t = e.indexMap;
            let r = 0;
            for (const e of this.keys()) {
                if (t[r] > -1) {
                    t.deletedIndices.push(t[r]);
                    t.deletedItems.push(e);
                }
                r++;
            }
            Me.call(this);
            t.length = 0;
            e.notify();
        }
        return undefined;
    },
    delete: function(e) {
        const t = Pe.get(this);
        if (t === undefined) {
            return Re.call(this, e);
        }
        const r = this.size;
        if (r === 0) {
            return false;
        }
        let n = 0;
        const i = t.indexMap;
        for (const r of this.keys()) {
            if (r === e) {
                if (i[n] > -1) {
                    i.deletedIndices.push(i[n]);
                    i.deletedItems.push(r);
                }
                i.splice(n, 1);
                const o = Re.call(this, e);
                if (o === true) {
                    t.notify();
                }
                return o;
            }
            ++n;
        }
        return false;
    }
};

const De = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const e of Be) {
    h($e[e], "observing", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

let Fe = false;

const je = "__au_map_on__";

function enableMapObservation() {
    if (!(v(je, Map) ?? false)) {
        x(je, true, Map);
        for (const e of Be) {
            if (Ie[e].observing !== true) {
                h(Ie, e, {
                    ...De,
                    value: $e[e]
                });
            }
        }
    }
}

function disableMapObservation() {
    for (const e of Be) {
        if (Ie[e].observing === true) {
            h(Ie, e, {
                ...De,
                value: _e[e]
            });
        }
    }
}

class MapObserver {
    constructor(e) {
        this.type = te;
        if (!Fe) {
            Fe = true;
            enableMapObservation();
        }
        this.collection = e;
        this.indexMap = createIndexMap(e.size);
        this.lenObs = void 0;
        Pe.set(e, this);
    }
    notify() {
        const e = this.subs;
        const t = this.indexMap;
        if (oe) {
            addCollectionBatch(e, this.collection, t);
            return;
        }
        const r = this.collection;
        const n = r.size;
        this.indexMap = createIndexMap(n);
        e.notifyCollection(r, t);
    }
    getLengthObserver() {
        return this.lenObs ?? (this.lenObs = new CollectionSizeObserver(this));
    }
}

subscriberCollection(MapObserver);

function getMapObserver(e) {
    let t = Pe.get(e);
    if (t === void 0) {
        t = new MapObserver(e);
    }
    return t;
}

function getObserverRecord() {
    return defineHiddenProp(this, "obs", new BindingObserverRecord(this));
}

function observe(e, t) {
    this.obs.add(this.oL.getObserver(e, t));
}

function observeCollection$1(e) {
    let t;
    if (isArray(e)) {
        t = getArrayObserver(e);
    } else if (isSet(e)) {
        t = getSetObserver(e);
    } else if (isMap(e)) {
        t = getMapObserver(e);
    } else {
        throw createMappedError(210, e);
    }
    this.obs.add(t);
}

function subscribeTo(e) {
    this.obs.add(e);
}

function noopHandleChange() {
    throw createMappedError(99, "handleChange");
}

function noopHandleCollectionChange() {
    throw createMappedError(99, "handleCollectionChange");
}

class BindingObserverRecord {
    constructor(e) {
        this.version = 0;
        this.count = 0;
        this.o = new Map;
        this.b = e;
    }
    add(e) {
        if (!this.o.has(e)) {
            e.subscribe(this.b);
            ++this.count;
        }
        this.o.set(e, this.version);
    }
    clear() {
        this.o.forEach(unsubscribeStale, this);
        this.count = this.o.size;
    }
    clearAll() {
        this.o.forEach(unsubscribeAll, this);
        this.o.clear();
        this.count = 0;
    }
}

function unsubscribeAll(e, t) {
    t.unsubscribe(this.b);
}

function unsubscribeStale(e, t) {
    if (this.version !== e) {
        t.unsubscribe(this.b);
        this.o.delete(t);
    }
}

function connectableDecorator(e) {
    const t = e.prototype;
    ensureProto(t, "observe", observe);
    ensureProto(t, "observeCollection", observeCollection$1);
    ensureProto(t, "subscribeTo", subscribeTo);
    h(t, "obs", {
        get: getObserverRecord
    });
    ensureProto(t, "handleChange", noopHandleChange);
    ensureProto(t, "handleCollectionChange", noopHandleCollectionChange);
    return e;
}

function connectable(e) {
    return e == null ? connectableDecorator : connectableDecorator(e);
}

const Ne = b("IExpressionParser", (e => e.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.i = createLookup();
        this.u = createLookup();
        this.h = createLookup();
    }
    parse(e, t) {
        let r;
        switch (t) {
          case et:
            return new CustomExpression(e);

          case Je:
            r = this.h[e];
            if (r === void 0) {
                r = this.h[e] = this.$parse(e, t);
            }
            return r;

          case Qe:
            r = this.u[e];
            if (r === void 0) {
                r = this.u[e] = this.$parse(e, t);
            }
            return r;

          default:
            {
                if (e.length === 0) {
                    if (t === Ye || t === Ze) {
                        return PrimitiveLiteralExpression.$empty;
                    }
                    throw invalidEmptyExpression();
                }
                r = this.i[e];
                if (r === void 0) {
                    r = this.i[e] = this.$parse(e, t);
                }
                return r;
            }
        }
    }
    $parse(e, t) {
        tt = e;
        st = 0;
        rt = e.length;
        nt = 0;
        it = 0;
        ot = 6291456;
        at = "";
        ct = $charCodeAt(0);
        ut = true;
        lt = false;
        ht = true;
        ft = -1;
        return parse(61, t === void 0 ? Ze : t);
    }
}

function unescapeCode(e) {
    switch (e) {
      case 98:
        return 8;

      case 116:
        return 9;

      case 110:
        return 10;

      case 118:
        return 11;

      case 102:
        return 12;

      case 114:
        return 13;

      case 34:
        return 34;

      case 39:
        return 39;

      case 92:
        return 92;

      default:
        return e;
    }
}

const Ve = PrimitiveLiteralExpression.$false;

const Ue = PrimitiveLiteralExpression.$true;

const He = PrimitiveLiteralExpression.$null;

const Ke = PrimitiveLiteralExpression.$undefined;

const ze = new AccessThisExpression(0);

const Ge = new AccessThisExpression(1);

const We = new AccessBoundaryExpression;

const qe = "None";

const Je = "Interpolation";

const Qe = "IsIterator";

const Xe = "IsChainable";

const Ye = "IsFunction";

const Ze = "IsProperty";

const et = "IsCustom";

let tt = "";

let st = 0;

let rt = 0;

let nt = 0;

let it = 0;

let ot = 6291456;

let at = "";

let ct;

let ut = true;

let lt = false;

let ht = true;

let ft = -1;

const pt = String.fromCharCode;

const $charCodeAt = e => tt.charCodeAt(e);

const $tokenRaw = () => tt.slice(it, st);

const dt = ("Infinity NaN isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent" + " Array BigInt Boolean Date Map Number Object RegExp Set String JSON Math Intl").split(" ");

function parseExpression(e, t) {
    tt = e;
    st = 0;
    rt = e.length;
    nt = 0;
    it = 0;
    ot = 6291456;
    at = "";
    ct = $charCodeAt(0);
    ut = true;
    lt = false;
    ht = true;
    ft = -1;
    return parse(61, t === void 0 ? Ze : t);
}

function parse(e, t) {
    if (t === et) {
        return new CustomExpression(tt);
    }
    if (st === 0) {
        if (t === Je) {
            return parseInterpolation();
        }
        nextToken();
        if (ot & 4194304) {
            throw invalidStartOfExpression();
        }
    }
    ut = 513 > e;
    lt = false;
    ht = 514 > e;
    let r = false;
    let n = void 0;
    let i = 0;
    if (ot & 131072) {
        const e = bt[ot & 63];
        nextToken();
        n = new UnaryExpression(e, parse(514, t));
        ut = false;
    } else {
        e: switch (ot) {
          case 12295:
            i = nt;
            ut = false;
            ht = false;
            do {
                nextToken();
                ++i;
                switch (ot) {
                  case 65546:
                    nextToken();
                    if ((ot & 12288) === 0) {
                        throw expectedIdentifier();
                    }
                    break;

                  case 11:
                  case 12:
                    throw expectedIdentifier();

                  case 2162701:
                    lt = true;
                    nextToken();
                    if ((ot & 12288) === 0) {
                        n = i === 0 ? ze : i === 1 ? Ge : new AccessThisExpression(i);
                        r = true;
                        break e;
                    }
                    break;

                  default:
                    if (ot & 2097152) {
                        n = i === 0 ? ze : i === 1 ? Ge : new AccessThisExpression(i);
                        break e;
                    }
                    throw invalidMemberExpression();
                }
            } while (ot === 12295);

          case 4096:
            {
                const e = at;
                if (t === Qe) {
                    n = new BindingIdentifier(e);
                } else if (ht && dt.includes(e)) {
                    n = new AccessGlobalExpression(e);
                } else if (ht && e === "import") {
                    throw unexpectedImportKeyword();
                } else {
                    n = new AccessScopeExpression(e, i);
                }
                ut = !lt;
                nextToken();
                if (consumeOpt(51)) {
                    if (ot === 524297) {
                        throw functionBodyInArrowFn();
                    }
                    const t = lt;
                    const r = nt;
                    ++nt;
                    const i = parse(62, qe);
                    lt = t;
                    nt = r;
                    ut = false;
                    n = new ArrowFunction([ new BindingIdentifier(e) ], i);
                }
                break;
            }

          case 11:
            throw unexpectedDoubleDot();

          case 12:
            throw invalidSpreadOp();

          case 12292:
            ut = false;
            nextToken();
            switch (nt) {
              case 0:
                n = ze;
                break;

              case 1:
                n = Ge;
                break;

              default:
                n = new AccessThisExpression(nt);
                break;
            }
            break;

          case 12293:
            ut = false;
            nextToken();
            n = We;
            break;

          case 2688008:
            n = parseCoverParenthesizedExpressionAndArrowParameterList(t);
            break;

          case 2688019:
            n = tt.search(/\s+of\s+/) > st ? parseArrayDestructuring() : parseArrayLiteralExpression(t);
            break;

          case 524297:
            n = parseObjectLiteralExpression(t);
            break;

          case 2163760:
            n = new TemplateExpression([ at ]);
            ut = false;
            nextToken();
            break;

          case 2163761:
            n = parseTemplate(t, n, false);
            break;

          case 16384:
          case 32768:
            n = new PrimitiveLiteralExpression(at);
            ut = false;
            nextToken();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            n = bt[ot & 63];
            ut = false;
            nextToken();
            break;

          default:
            if (st >= rt) {
                throw unexpectedEndOfExpression();
            } else {
                throw unconsumedToken();
            }
        }
        if (t === Qe) {
            return parseForOfStatement(n);
        }
        if (514 < e) {
            return n;
        }
        if (ot === 11 || ot === 12) {
            throw expectedIdentifier();
        }
        if (n.$kind === E) {
            switch (ot) {
              case 2162701:
                lt = true;
                ut = false;
                nextToken();
                if ((ot & 13312) === 0) {
                    throw unexpectedTokenInOptionalChain();
                }
                if (ot & 12288) {
                    n = new AccessScopeExpression(at, n.ancestor);
                    nextToken();
                } else if (ot === 2688008) {
                    n = new CallFunctionExpression(n, parseArguments(), true);
                } else if (ot === 2688019) {
                    n = parseKeyedExpression(n, true);
                } else {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                break;

              case 65546:
                ut = !lt;
                nextToken();
                if ((ot & 12288) === 0) {
                    throw expectedIdentifier();
                }
                n = new AccessScopeExpression(at, n.ancestor);
                nextToken();
                break;

              case 11:
              case 12:
                throw expectedIdentifier();

              case 2688008:
                n = new CallFunctionExpression(n, parseArguments(), r);
                break;

              case 2688019:
                n = parseKeyedExpression(n, r);
                break;

              case 2163760:
                n = createTemplateTail(n);
                break;

              case 2163761:
                n = parseTemplate(t, n, true);
                break;
            }
        }
        while ((ot & 65536) > 0) {
            switch (ot) {
              case 2162701:
                n = parseOptionalChainLHS(n);
                break;

              case 65546:
                nextToken();
                if ((ot & 12288) === 0) {
                    throw expectedIdentifier();
                }
                n = parseMemberExpressionLHS(n, false);
                break;

              case 11:
              case 12:
                throw expectedIdentifier();

              case 2688008:
                if (n.$kind === C) {
                    n = new CallScopeExpression(n.name, parseArguments(), n.ancestor, false);
                } else if (n.$kind === R) {
                    n = new CallMemberExpression(n.object, n.name, parseArguments(), n.optional, false);
                } else if (n.$kind === A) {
                    n = new CallGlobalExpression(n.name, parseArguments());
                } else {
                    n = new CallFunctionExpression(n, parseArguments(), false);
                }
                break;

              case 2688019:
                n = parseKeyedExpression(n, false);
                break;

              case 2163760:
                if (lt) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = createTemplateTail(n);
                break;

              case 2163761:
                if (lt) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                n = parseTemplate(t, n, true);
                break;
            }
        }
    }
    if (ot === 11 || ot === 12) {
        throw expectedIdentifier();
    }
    if (513 < e) {
        return n;
    }
    while ((ot & 262144) > 0) {
        const r = ot;
        if ((r & 960) <= e) {
            break;
        }
        nextToken();
        n = new BinaryExpression(bt[r & 63], n, parse(r & 960, t));
        ut = false;
    }
    if (63 < e) {
        return n;
    }
    if (consumeOpt(6291479)) {
        const e = parse(62, t);
        consume(6291477);
        n = new ConditionalExpression(n, e, parse(62, t));
        ut = false;
    }
    if (62 < e) {
        return n;
    }
    if (consumeOpt(4194350)) {
        if (!ut) {
            throw lhsNotAssignable();
        }
        n = new AssignExpression(n, parse(62, t));
    }
    if (61 < e) {
        return n;
    }
    while (consumeOpt(6291481)) {
        if (ot === 6291456) {
            throw expectedValueConverterIdentifier();
        }
        const e = at;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291477)) {
            r.push(parse(62, t));
        }
        n = new ValueConverterExpression(n, e, r);
    }
    while (consumeOpt(6291480)) {
        if (ot === 6291456) {
            throw expectedBindingBehaviorIdentifier();
        }
        const e = at;
        nextToken();
        const r = new Array;
        while (consumeOpt(6291477)) {
            r.push(parse(62, t));
        }
        n = new BindingBehaviorExpression(n, e, r);
    }
    if (ot !== 6291456) {
        if (t === Je && ot === 7340046) {
            return n;
        }
        if (t === Xe && ot === 6291478) {
            if (st === rt) {
                throw unconsumedToken();
            }
            ft = st - 1;
            return n;
        }
        if ($tokenRaw() === "of") {
            throw unexpectedOfKeyword();
        }
        throw unconsumedToken();
    }
    return n;
}

function parseArrayDestructuring() {
    const e = [];
    const t = new DestructuringAssignmentExpression(W, e, void 0, void 0);
    let r = "";
    let n = true;
    let i = 0;
    while (n) {
        nextToken();
        switch (ot) {
          case 7340052:
            n = false;
            addItem();
            break;

          case 6291472:
            addItem();
            break;

          case 4096:
            r = $tokenRaw();
            break;

          default:
            throw unexpectedTokenInDestructuring();
        }
    }
    consume(7340052);
    return t;
    function addItem() {
        if (r !== "") {
            e.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(ze, r), new AccessKeyedExpression(ze, new PrimitiveLiteralExpression(i++)), void 0));
            r = "";
        } else {
            i++;
        }
    }
}

function parseArguments() {
    const e = lt;
    nextToken();
    const t = [];
    while (ot !== 7340047) {
        t.push(parse(62, qe));
        if (!consumeOpt(6291472)) {
            break;
        }
    }
    consume(7340047);
    ut = false;
    lt = e;
    return t;
}

function parseKeyedExpression(e, t) {
    const r = lt;
    nextToken();
    e = new AccessKeyedExpression(e, parse(62, qe), t);
    consume(7340052);
    ut = !r;
    lt = r;
    return e;
}

function parseOptionalChainLHS(e) {
    lt = true;
    ut = false;
    nextToken();
    if ((ot & 13312) === 0) {
        throw unexpectedTokenInOptionalChain();
    }
    if (ot & 12288) {
        return parseMemberExpressionLHS(e, true);
    }
    if (ot === 2688008) {
        if (e.$kind === C) {
            return new CallScopeExpression(e.name, parseArguments(), e.ancestor, true);
        } else if (e.$kind === R) {
            return new CallMemberExpression(e.object, e.name, parseArguments(), e.optional, true);
        } else {
            return new CallFunctionExpression(e, parseArguments(), true);
        }
    }
    if (ot === 2688019) {
        return parseKeyedExpression(e, true);
    }
    throw invalidTaggedTemplateOnOptionalChain();
}

function parseMemberExpressionLHS(e, t) {
    const r = at;
    switch (ot) {
      case 2162701:
        {
            lt = true;
            ut = false;
            const n = st;
            const i = it;
            const o = ot;
            const a = ct;
            const c = at;
            const u = ut;
            const l = lt;
            nextToken();
            if ((ot & 13312) === 0) {
                throw unexpectedTokenInOptionalChain();
            }
            if (ot === 2688008) {
                return new CallMemberExpression(e, r, parseArguments(), t, true);
            }
            st = n;
            it = i;
            ot = o;
            ct = a;
            at = c;
            ut = u;
            lt = l;
            return new AccessMemberExpression(e, r, t);
        }

      case 2688008:
        {
            ut = false;
            return new CallMemberExpression(e, r, parseArguments(), t, false);
        }

      default:
        {
            ut = !lt;
            nextToken();
            return new AccessMemberExpression(e, r, t);
        }
    }
}

function parseCoverParenthesizedExpressionAndArrowParameterList(e) {
    nextToken();
    const t = st;
    const r = it;
    const n = ot;
    const i = ct;
    const o = at;
    const a = ut;
    const c = lt;
    const u = [];
    let l = 1;
    let h = false;
    e: while (true) {
        if (ot === 12) {
            nextToken();
            if (ot !== 4096) {
                throw expectedIdentifier();
            }
            u.push(new BindingIdentifier(at));
            nextToken();
            if (ot === 6291472) {
                throw restParamsMustBeLastParam();
            }
            if (ot !== 7340047) {
                throw invalidSpreadOp();
            }
            nextToken();
            if (ot !== 51) {
                throw invalidSpreadOp();
            }
            nextToken();
            const e = lt;
            const t = nt;
            ++nt;
            const r = parse(62, qe);
            lt = e;
            nt = t;
            ut = false;
            return new ArrowFunction(u, r, true);
        }
        switch (ot) {
          case 4096:
            u.push(new BindingIdentifier(at));
            nextToken();
            break;

          case 7340047:
            nextToken();
            break e;

          case 524297:
          case 2688019:
            nextToken();
            l = 4;
            break;

          case 6291472:
            l = 2;
            h = true;
            break e;

          case 2688008:
            l = 2;
            break e;

          default:
            nextToken();
            l = 2;
            break;
        }
        switch (ot) {
          case 6291472:
            nextToken();
            h = true;
            if (l === 1) {
                break;
            }
            break e;

          case 7340047:
            nextToken();
            break e;

          case 4194350:
            if (l === 1) {
                l = 3;
            }
            break e;

          case 51:
            if (h) {
                throw invalidArrowParameterList();
            }
            nextToken();
            l = 2;
            break e;

          default:
            if (l === 1) {
                l = 2;
            }
            break e;
        }
    }
    if (ot === 51) {
        if (l === 1) {
            nextToken();
            if (ot === 524297) {
                throw functionBodyInArrowFn();
            }
            const e = lt;
            const t = nt;
            ++nt;
            const r = parse(62, qe);
            lt = e;
            nt = t;
            ut = false;
            return new ArrowFunction(u, r);
        }
        throw invalidArrowParameterList();
    } else if (l === 1 && u.length === 0) {
        throw missingExpectedToken();
    }
    if (h) {
        switch (l) {
          case 2:
            throw invalidArrowParameterList();

          case 3:
            throw defaultParamsInArrowFn();

          case 4:
            throw destructuringParamsInArrowFn();
        }
    }
    st = t;
    it = r;
    ot = n;
    ct = i;
    at = o;
    ut = a;
    lt = c;
    const f = lt;
    const p = parse(62, e);
    lt = f;
    consume(7340047);
    if (ot === 51) {
        switch (l) {
          case 2:
            throw invalidArrowParameterList();

          case 3:
            throw defaultParamsInArrowFn();

          case 4:
            throw destructuringParamsInArrowFn();
        }
    }
    return p;
}

function parseArrayLiteralExpression(e) {
    const t = lt;
    nextToken();
    const r = new Array;
    while (ot !== 7340052) {
        if (consumeOpt(6291472)) {
            r.push(Ke);
            if (ot === 7340052) {
                break;
            }
        } else {
            r.push(parse(62, e === Qe ? qe : e));
            if (consumeOpt(6291472)) {
                if (ot === 7340052) {
                    break;
                }
            } else {
                break;
            }
        }
    }
    lt = t;
    consume(7340052);
    if (e === Qe) {
        return new ArrayBindingPattern(r);
    } else {
        ut = false;
        return new ArrayLiteralExpression(r);
    }
}

const wt = [ U, H, K, W, q ];

function parseForOfStatement(e) {
    if (!wt.includes(e.$kind)) {
        throw invalidLHSBindingIdentifierInForOf(e.$kind);
    }
    if (ot !== 4204594) {
        throw invalidLHSBindingIdentifierInForOf(e.$kind);
    }
    nextToken();
    const t = e;
    const r = parse(61, Xe);
    return new ForOfStatement(t, r, ft);
}

function parseObjectLiteralExpression(e) {
    const t = lt;
    const r = new Array;
    const n = new Array;
    nextToken();
    while (ot !== 7340046) {
        r.push(at);
        if (ot & 49152) {
            nextToken();
            consume(6291477);
            n.push(parse(62, e === Qe ? qe : e));
        } else if (ot & 12288) {
            const t = ct;
            const r = ot;
            const i = st;
            nextToken();
            if (consumeOpt(6291477)) {
                n.push(parse(62, e === Qe ? qe : e));
            } else {
                ct = t;
                ot = r;
                st = i;
                n.push(parse(515, e === Qe ? qe : e));
            }
        } else {
            throw invalidPropDefInObjLiteral();
        }
        if (ot !== 7340046) {
            consume(6291472);
        }
    }
    lt = t;
    consume(7340046);
    if (e === Qe) {
        return new ObjectBindingPattern(r, n);
    } else {
        ut = false;
        return new ObjectLiteralExpression(r, n);
    }
}

function parseInterpolation() {
    const e = [];
    const t = [];
    const r = rt;
    let n = "";
    while (st < r) {
        switch (ct) {
          case 36:
            if ($charCodeAt(st + 1) === 123) {
                e.push(n);
                n = "";
                st += 2;
                ct = $charCodeAt(st);
                nextToken();
                const r = parse(61, Je);
                t.push(r);
                continue;
            } else {
                n += "$";
            }
            break;

          case 92:
            n += pt(unescapeCode(nextChar()));
            break;

          default:
            n += pt(ct);
        }
        nextChar();
    }
    if (t.length) {
        e.push(n);
        return new Interpolation(e, t);
    }
    return null;
}

function parseTemplate(e, t, r) {
    const n = lt;
    const i = [ at ];
    consume(2163761);
    const o = [ parse(62, e) ];
    while ((ot = scanTemplateTail()) !== 2163760) {
        i.push(at);
        consume(2163761);
        o.push(parse(62, e));
    }
    i.push(at);
    ut = false;
    lt = n;
    if (r) {
        nextToken();
        return new TaggedTemplateExpression(i, i, t, o);
    } else {
        nextToken();
        return new TemplateExpression(i, o);
    }
}

function createTemplateTail(e) {
    ut = false;
    const t = [ at ];
    nextToken();
    return new TaggedTemplateExpression(t, t, e);
}

function nextToken() {
    while (st < rt) {
        it = st;
        if ((ot = yt[ct]()) != null) {
            return;
        }
    }
    ot = 6291456;
}

function nextChar() {
    return ct = $charCodeAt(++st);
}

function scanIdentifier() {
    while (Et[nextChar()]) ;
    const e = vt[at = $tokenRaw()];
    return e === undefined ? 4096 : e;
}

function scanNumber(e) {
    let t = ct;
    if (e === false) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
        if (t !== 46) {
            at = parseInt($tokenRaw(), 10);
            return 32768;
        }
        t = nextChar();
        if (st >= rt) {
            at = parseInt($tokenRaw().slice(0, -1), 10);
            return 32768;
        }
    }
    if (t <= 57 && t >= 48) {
        do {
            t = nextChar();
        } while (t <= 57 && t >= 48);
    } else {
        ct = $charCodeAt(--st);
    }
    at = parseFloat($tokenRaw());
    return 32768;
}

function scanString() {
    const e = ct;
    nextChar();
    let t = 0;
    const r = new Array;
    let n = st;
    while (ct !== e) {
        if (ct === 92) {
            r.push(tt.slice(n, st));
            nextChar();
            t = unescapeCode(ct);
            nextChar();
            r.push(pt(t));
            n = st;
        } else if (st >= rt) {
            throw unterminatedStringLiteral();
        } else {
            nextChar();
        }
    }
    const i = tt.slice(n, st);
    nextChar();
    r.push(i);
    const o = r.join("");
    at = o;
    return 16384;
}

function scanTemplate() {
    let e = true;
    let t = "";
    while (nextChar() !== 96) {
        if (ct === 36) {
            if (st + 1 < rt && $charCodeAt(st + 1) === 123) {
                st++;
                e = false;
                break;
            } else {
                t += "$";
            }
        } else if (ct === 92) {
            t += pt(unescapeCode(nextChar()));
        } else {
            if (st >= rt) {
                throw unterminatedTemplateLiteral();
            }
            t += pt(ct);
        }
    }
    nextChar();
    at = t;
    if (e) {
        return 2163760;
    }
    return 2163761;
}

const scanTemplateTail = () => {
    if (st >= rt) {
        throw unterminatedTemplateLiteral();
    }
    st--;
    return scanTemplate();
};

const consumeOpt = e => {
    if (ot === e) {
        nextToken();
        return true;
    }
    return false;
};

const consume = e => {
    if (ot === e) {
        nextToken();
    } else {
        throw missingExpectedToken();
    }
};

const invalidStartOfExpression = () => createMappedError(151, tt);

const invalidSpreadOp = () => createMappedError(152, tt);

const expectedIdentifier = () => createMappedError(153, tt);

const invalidMemberExpression = () => createMappedError(154, tt);

const unexpectedEndOfExpression = () => createMappedError(155, tt);

const unconsumedToken = () => createMappedError(156, $tokenRaw(), st, tt);

const invalidEmptyExpression = () => createMappedError(157);

const lhsNotAssignable = () => createMappedError(158, tt);

const expectedValueConverterIdentifier = () => createMappedError(159, tt);

const expectedBindingBehaviorIdentifier = () => createMappedError(160, tt);

const unexpectedOfKeyword = () => createMappedError(161, tt);

const unexpectedImportKeyword = () => createMappedError(162, tt);

const invalidLHSBindingIdentifierInForOf = e => createMappedError(163, tt, e);

const invalidPropDefInObjLiteral = () => createMappedError(164, tt);

const unterminatedStringLiteral = () => createMappedError(165, tt);

const unterminatedTemplateLiteral = () => createMappedError(166, tt);

const missingExpectedToken = e => createMappedError(167, tt);

const unexpectedCharacter = () => {
    throw createMappedError(168, tt);
};

unexpectedCharacter.notMapped = true;

const unexpectedTokenInDestructuring = () => createMappedError(170, tt);

const unexpectedTokenInOptionalChain = () => createMappedError(171, tt);

const invalidTaggedTemplateOnOptionalChain = () => createMappedError(172, tt);

const invalidArrowParameterList = () => createMappedError(173, tt);

const defaultParamsInArrowFn = () => createMappedError(174, tt);

const destructuringParamsInArrowFn = () => createMappedError(175, tt);

const restParamsMustBeLastParam = () => createMappedError(176, tt);

const functionBodyInArrowFn = () => createMappedError(178, tt);

const unexpectedDoubleDot = () => createMappedError(179, tt);

const bt = [ Ve, Ue, He, Ke, "this", "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163760, 2163761, "of", "=>" ];

const vt = p(Object.create(null), {
    true: 8193,
    null: 8194,
    false: 8192,
    undefined: 8195,
    this: 12293,
    $this: 12292,
    $parent: 12295,
    in: 6562213,
    instanceof: 6562214,
    typeof: 139305,
    void: 139306,
    of: 4204594
});

const gt = {
    AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
    IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
    Digit: [ 48, 58 ],
    Skip: [ 0, 33, 127, 161 ]
};

const decompress = (e, t, r, n) => {
    const i = r.length;
    for (let o = 0; o < i; o += 2) {
        const i = r[o];
        let a = r[o + 1];
        a = a > 0 ? a : i + 1;
        if (e) {
            e.fill(n, i, a);
        }
        if (t) {
            for (let e = i; e < a; e++) {
                t.add(e);
            }
        }
    }
};

const returnToken = e => () => {
    nextChar();
    return e;
};

const xt = new Set;

decompress(null, xt, gt.AsciiIdPart, true);

const Et = new Uint8Array(65535);

decompress(Et, null, gt.IdStart, 1);

decompress(Et, null, gt.Digit, 1);

const yt = new Array(65535);

yt.fill(unexpectedCharacter, 0, 65535);

decompress(yt, null, gt.Skip, (() => {
    nextChar();
    return null;
}));

decompress(yt, null, gt.IdStart, scanIdentifier);

decompress(yt, null, gt.Digit, (() => scanNumber(false)));

yt[34] = yt[39] = () => scanString();

yt[96] = () => scanTemplate();

yt[33] = () => {
    if (nextChar() !== 61) {
        return 131119;
    }
    if (nextChar() !== 61) {
        return 6553950;
    }
    nextChar();
    return 6553952;
};

yt[61] = () => {
    if (nextChar() === 62) {
        nextChar();
        return 51;
    }
    if (ct !== 61) {
        return 4194350;
    }
    if (nextChar() !== 61) {
        return 6553949;
    }
    nextChar();
    return 6553951;
};

yt[38] = () => {
    if (nextChar() !== 38) {
        return 6291480;
    }
    nextChar();
    return 6553884;
};

yt[124] = () => {
    if (nextChar() !== 124) {
        return 6291481;
    }
    nextChar();
    return 6553819;
};

yt[63] = () => {
    if (nextChar() === 46) {
        const e = $charCodeAt(st + 1);
        if (e <= 48 || e >= 57) {
            nextChar();
            return 2162701;
        }
        return 6291479;
    }
    if (ct !== 63) {
        return 6291479;
    }
    nextChar();
    return 6553754;
};

yt[46] = () => {
    if (nextChar() <= 57 && ct >= 48) {
        return scanNumber(true);
    }
    if (ct === 46) {
        if (nextChar() !== 46) {
            return 11;
        }
        nextChar();
        return 12;
    }
    return 65546;
};

yt[60] = () => {
    if (nextChar() !== 61) {
        return 6554017;
    }
    nextChar();
    return 6554019;
};

yt[62] = () => {
    if (nextChar() !== 61) {
        return 6554018;
    }
    nextChar();
    return 6554020;
};

yt[37] = returnToken(6554156);

yt[40] = returnToken(2688008);

yt[41] = returnToken(7340047);

yt[42] = returnToken(6554155);

yt[43] = returnToken(2490855);

yt[44] = returnToken(6291472);

yt[45] = returnToken(2490856);

yt[47] = returnToken(6554157);

yt[58] = returnToken(6291477);

yt[59] = returnToken(6291478);

yt[91] = returnToken(2688019);

yt[93] = returnToken(7340052);

yt[123] = returnToken(524297);

yt[125] = returnToken(7340046);

let At = null;

const Ct = [];

let mt = false;

function pauseConnecting() {
    mt = false;
}

function resumeConnecting() {
    mt = true;
}

function currentConnectable() {
    return At;
}

function enterConnectable(e) {
    if (e == null) {
        throw createMappedError(206);
    }
    if (At == null) {
        At = e;
        Ct[0] = At;
        mt = true;
        return;
    }
    if (At === e) {
        throw createMappedError(207);
    }
    Ct.push(e);
    At = e;
    mt = true;
}

function exitConnectable(e) {
    if (e == null) {
        throw createMappedError(208);
    }
    if (At !== e) {
        throw createMappedError(209);
    }
    Ct.pop();
    At = Ct.length > 0 ? Ct[Ct.length - 1] : null;
    mt = At != null;
}

const kt = /*@__PURE__*/ d({
    get current() {
        return At;
    },
    get connecting() {
        return mt;
    },
    enter: enterConnectable,
    exit: exitConnectable,
    pause: pauseConnecting,
    resume: resumeConnecting
});

const Ot = Reflect.get;

const St = Object.prototype.toString;

const Tt = new WeakMap;

const Pt = "__au_nw__";

const It = "__au_nw";

function canWrap(e) {
    switch (St.call(e)) {
      case "[object Object]":
        return e.constructor[Pt] !== true;

      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const Lt = "__raw__";

function wrap(e) {
    return canWrap(e) ? getProxy(e) : e;
}

function getProxy(e) {
    return Tt.get(e) ?? createProxy(e);
}

function getRaw(e) {
    return e[Lt] ?? e;
}

function unwrap(e) {
    return canWrap(e) && e[Lt] || e;
}

function doNotCollect(e, t) {
    return t === "constructor" || t === "__proto__" || t === "$observers" || t === Symbol.toPrimitive || t === Symbol.toStringTag || e.constructor[`${It}_${w(t)}__`] === true;
}

function createProxy(e) {
    const t = isArray(e) ? Rt : isMap(e) || isSet(e) ? _t : Mt;
    const r = new Proxy(e, t);
    Tt.set(e, r);
    Tt.set(r, r);
    return r;
}

const Mt = {
    get(e, t, r) {
        if (t === Lt) {
            return e;
        }
        const n = currentConnectable();
        if (!mt || doNotCollect(e, t) || n == null) {
            return Ot(e, t, r);
        }
        n.observe(e, t);
        return wrap(Ot(e, t, r));
    }
};

const Rt = {
    get(e, t, r) {
        if (t === Lt) {
            return e;
        }
        if (!mt || doNotCollect(e, t) || At == null) {
            return Ot(e, t, r);
        }
        switch (t) {
          case "length":
            At.observe(e, "length");
            return e.length;

          case "map":
            return wrappedArrayMap;

          case "includes":
            return wrappedArrayIncludes;

          case "indexOf":
            return wrappedArrayIndexOf;

          case "lastIndexOf":
            return wrappedArrayLastIndexOf;

          case "every":
            return wrappedArrayEvery;

          case "filter":
            return wrappedArrayFilter;

          case "find":
            return wrappedArrayFind;

          case "findIndex":
            return wrappedArrayFindIndex;

          case "flat":
            return wrappedArrayFlat;

          case "flatMap":
            return wrappedArrayFlatMap;

          case "join":
            return wrappedArrayJoin;

          case "push":
            return wrappedArrayPush;

          case "pop":
            return wrappedArrayPop;

          case "reduce":
            return wrappedReduce;

          case "reduceRight":
            return wrappedReduceRight;

          case "reverse":
            return wrappedArrayReverse;

          case "shift":
            return wrappedArrayShift;

          case "unshift":
            return wrappedArrayUnshift;

          case "slice":
            return wrappedArraySlice;

          case "splice":
            return wrappedArraySplice;

          case "some":
            return wrappedArraySome;

          case "sort":
            return wrappedArraySort;

          case "keys":
            return wrappedKeys;

          case "values":
          case Symbol.iterator:
            return wrappedValues;

          case "entries":
            return wrappedEntries;
        }
        At.observe(e, t);
        return wrap(Ot(e, t, r));
    },
    ownKeys(e) {
        currentConnectable()?.observe(e, "length");
        return Reflect.ownKeys(e);
    }
};

function wrappedArrayMap(e, t) {
    const r = getRaw(this);
    const n = r.map(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(At, r);
    return wrap(n);
}

function wrappedArrayEvery(e, t) {
    const r = getRaw(this);
    const n = r.every(((r, n) => e.call(t, wrap(r), n, this)));
    observeCollection(At, r);
    return n;
}

function wrappedArrayFilter(e, t) {
    const r = getRaw(this);
    const n = r.filter(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(At, r);
    return wrap(n);
}

function wrappedArrayIncludes(e) {
    const t = getRaw(this);
    const r = t.includes(unwrap(e));
    observeCollection(At, t);
    return r;
}

function wrappedArrayIndexOf(e) {
    const t = getRaw(this);
    const r = t.indexOf(unwrap(e));
    observeCollection(At, t);
    return r;
}

function wrappedArrayLastIndexOf(e) {
    const t = getRaw(this);
    const r = t.lastIndexOf(unwrap(e));
    observeCollection(At, t);
    return r;
}

function wrappedArrayFindIndex(e, t) {
    const r = getRaw(this);
    const n = r.findIndex(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(At, r);
    return n;
}

function wrappedArrayFind(e, t) {
    const r = getRaw(this);
    const n = r.find(((t, r) => e(wrap(t), r, this)), t);
    observeCollection(At, r);
    return wrap(n);
}

function wrappedArrayFlat() {
    const e = getRaw(this);
    observeCollection(At, e);
    return wrap(e.flat());
}

function wrappedArrayFlatMap(e, t) {
    const r = getRaw(this);
    observeCollection(At, r);
    return getProxy(r.flatMap(((r, n) => wrap(e.call(t, wrap(r), n, this)))));
}

function wrappedArrayJoin(e) {
    const t = getRaw(this);
    observeCollection(At, t);
    return t.join(e);
}

function wrappedArrayPop() {
    return wrap(getRaw(this).pop());
}

function wrappedArrayPush(...e) {
    return getRaw(this).push(...e);
}

function wrappedArrayShift() {
    return wrap(getRaw(this).shift());
}

function wrappedArrayUnshift(...e) {
    return getRaw(this).unshift(...e);
}

function wrappedArraySplice(...e) {
    return wrap(getRaw(this).splice(...e));
}

function wrappedArrayReverse(...e) {
    const t = getRaw(this);
    const r = t.reverse();
    observeCollection(At, t);
    return wrap(r);
}

function wrappedArraySome(e, t) {
    const r = getRaw(this);
    const n = r.some(((r, n) => unwrap(e.call(t, wrap(r), n, this))));
    observeCollection(At, r);
    return n;
}

function wrappedArraySort(e) {
    const t = getRaw(this);
    const r = t.sort(e);
    observeCollection(At, t);
    return wrap(r);
}

function wrappedArraySlice(e, t) {
    const r = getRaw(this);
    observeCollection(At, r);
    return getProxy(r.slice(e, t));
}

function wrappedReduce(e, t) {
    const r = getRaw(this);
    const n = r.reduce(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(At, r);
    return wrap(n);
}

function wrappedReduceRight(e, t) {
    const r = getRaw(this);
    const n = r.reduceRight(((t, r, n) => e(t, wrap(r), n, this)), t);
    observeCollection(At, r);
    return wrap(n);
}

const _t = {
    get(e, t, r) {
        if (t === Lt) {
            return e;
        }
        const n = currentConnectable();
        if (!mt || doNotCollect(e, t) || n == null) {
            return Ot(e, t, r);
        }
        switch (t) {
          case "size":
            n.observe(e, "size");
            return e.size;

          case "clear":
            return wrappedClear;

          case "delete":
            return wrappedDelete;

          case "forEach":
            return wrappedForEach;

          case "add":
            if (isSet(e)) {
                return wrappedAdd;
            }
            break;

          case "get":
            if (isMap(e)) {
                return wrappedGet;
            }
            break;

          case "set":
            if (isMap(e)) {
                return wrappedSet;
            }
            break;

          case "has":
            return wrappedHas;

          case "keys":
            return wrappedKeys;

          case "values":
            return wrappedValues;

          case "entries":
            return wrappedEntries;

          case Symbol.iterator:
            return isMap(e) ? wrappedEntries : wrappedValues;
        }
        return wrap(Ot(e, t, r));
    }
};

function wrappedForEach(e, t) {
    const r = getRaw(this);
    observeCollection(At, r);
    return r.forEach(((r, n) => {
        e.call(t, wrap(r), wrap(n), this);
    }));
}

function wrappedHas(e) {
    const t = getRaw(this);
    observeCollection(At, t);
    return t.has(unwrap(e));
}

function wrappedGet(e) {
    const t = getRaw(this);
    observeCollection(At, t);
    return wrap(t.get(unwrap(e)));
}

function wrappedSet(e, t) {
    return wrap(getRaw(this).set(unwrap(e), unwrap(t)));
}

function wrappedAdd(e) {
    return wrap(getRaw(this).add(unwrap(e)));
}

function wrappedClear() {
    return wrap(getRaw(this).clear());
}

function wrappedDelete(e) {
    return wrap(getRaw(this).delete(unwrap(e)));
}

function wrappedKeys() {
    const e = getRaw(this);
    observeCollection(At, e);
    const t = e.keys();
    return {
        next() {
            const e = t.next();
            const r = e.value;
            const n = e.done;
            return n ? {
                value: void 0,
                done: n
            } : {
                value: wrap(r),
                done: n
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function wrappedValues() {
    const e = getRaw(this);
    observeCollection(At, e);
    const t = e.values();
    return {
        next() {
            const e = t.next();
            const r = e.value;
            const n = e.done;
            return n ? {
                value: void 0,
                done: n
            } : {
                value: wrap(r),
                done: n
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function wrappedEntries() {
    const e = getRaw(this);
    observeCollection(At, e);
    const t = e.entries();
    return {
        next() {
            const e = t.next();
            const r = e.value;
            const n = e.done;
            return n ? {
                value: void 0,
                done: n
            } : {
                value: [ wrap(r[0]), wrap(r[1]) ],
                done: n
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

const observeCollection = (e, t) => e?.observeCollection(t);

const Bt = /*@__PURE__*/ d({
    getProxy: getProxy,
    getRaw: getRaw,
    wrap: wrap,
    unwrap: unwrap,
    rawKey: Lt
});

class ComputedObserver {
    constructor(e, t, r, n, i) {
        this.type = te;
        this.v = void 0;
        this.ir = false;
        this.D = false;
        this.cb = void 0;
        this.A = void 0;
        this.C = void 0;
        this.o = e;
        this.O = i ? wrap(e) : e;
        this.$get = t;
        this.$set = r;
        this.oL = n;
    }
    init(e) {
        this.v = e;
        this.D = false;
    }
    getValue() {
        if (this.subs.count === 0) {
            return this.$get.call(this.o, this.o, this);
        }
        if (this.D) {
            this.compute();
            this.D = false;
        }
        return this.v;
    }
    setValue(e) {
        if (isFunction(this.$set)) {
            if (this.A !== void 0) {
                e = this.A.call(null, e, this.C);
            }
            if (!f(e, this.v)) {
                this.ir = true;
                this.$set.call(this.o, e);
                this.ir = false;
                this.run();
            }
        } else {
            throw createMappedError(221);
        }
    }
    useCoercer(e, t) {
        this.A = e;
        this.C = t;
        return true;
    }
    useCallback(e) {
        this.cb = e;
        return true;
    }
    handleChange() {
        this.D = true;
        if (this.subs.count > 0) {
            this.run();
        }
    }
    handleCollectionChange() {
        this.D = true;
        if (this.subs.count > 0) {
            this.run();
        }
    }
    subscribe(e) {
        if (this.subs.add(e) && this.subs.count === 1) {
            this.compute();
            this.D = false;
        }
    }
    unsubscribe(e) {
        if (this.subs.remove(e) && this.subs.count === 0) {
            this.D = true;
            this.obs.clearAll();
        }
    }
    run() {
        if (this.ir) {
            return;
        }
        const e = this.v;
        const t = this.compute();
        this.D = false;
        if (!f(t, e)) {
            this.cb?.(t, e);
            this.subs.notify(this.v, e);
        }
    }
    compute() {
        this.ir = true;
        this.obs.version++;
        try {
            enterConnectable(this);
            return this.v = unwrap(this.$get.call(this.O, this.O, this));
        } finally {
            this.obs.clear();
            this.ir = false;
            exitConnectable(this);
        }
    }
}

connectable(ComputedObserver);

subscriberCollection(ComputedObserver);

const $t = /*@__PURE__*/ b("IDirtyChecker", void 0);

const Dt = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};

class DirtyChecker {
    static register(e) {
        e.register(i.singleton(this, this), i.aliasTo(this, $t));
    }
    constructor() {
        this.tracked = [];
        this.T = null;
        this.P = 0;
        this.p = o(a);
        this.check = () => {
            if (Dt.disabled) {
                return;
            }
            if (++this.P < Dt.timeoutsPerCheck) {
                return;
            }
            this.P = 0;
            const e = this.tracked;
            const t = e.length;
            let r;
            let n = 0;
            for (;n < t; ++n) {
                r = e[n];
                if (r.isDirty()) {
                    r.flush();
                }
            }
        };
        subscriberCollection(DirtyCheckProperty);
    }
    createProperty(e, t) {
        if (Dt.throw) {
            throw createError(`AUR0222:${w(t)}`);
        }
        return new DirtyCheckProperty(this, e, t);
    }
    addProperty(e) {
        this.tracked.push(e);
        if (this.tracked.length === 1) {
            this.T = this.p.taskQueue.queueTask(this.check, {
                persistent: true
            });
        }
    }
    removeProperty(e) {
        this.tracked.splice(this.tracked.indexOf(e), 1);
        if (this.tracked.length === 0) {
            this.T.cancel();
            this.T = null;
        }
    }
}

class DirtyCheckProperty {
    constructor(e, t, r) {
        this.obj = t;
        this.key = r;
        this.type = ee;
        this.ov = void 0;
        this.I = e;
    }
    getValue() {
        return this.obj[this.key];
    }
    setValue(e) {
        throw createError(`Trying to set value for property ${w(this.key)} in dirty checker`);
    }
    isDirty() {
        return this.ov !== this.obj[this.key];
    }
    flush() {
        const e = this.ov;
        const t = this.getValue();
        this.ov = t;
        this.subs.notify(t, e);
    }
    subscribe(e) {
        if (this.subs.add(e) && this.subs.count === 1) {
            this.ov = this.obj[this.key];
            this.I.addProperty(this);
        }
    }
    unsubscribe(e) {
        if (this.subs.remove(e) && this.subs.count === 0) {
            this.I.removeProperty(this);
        }
    }
}

class PrimitiveObserver {
    get doNotCache() {
        return true;
    }
    constructor(e, t) {
        this.type = ee;
        this.o = e;
        this.k = t;
    }
    getValue() {
        return this.o[this.k];
    }
    setValue() {}
    subscribe() {}
    unsubscribe() {}
}

class PropertyAccessor {
    constructor() {
        this.type = ee;
    }
    getValue(e, t) {
        return e[t];
    }
    setValue(e, t, r) {
        t[r] = e;
    }
}

class SetterObserver {
    constructor(e, t) {
        this.type = te;
        this.v = void 0;
        this.iO = false;
        this.cb = void 0;
        this.A = void 0;
        this.C = void 0;
        this.o = e;
        this.k = t;
    }
    getValue() {
        return this.v;
    }
    setValue(e) {
        if (this.A !== void 0) {
            e = this.A.call(void 0, e, this.C);
        }
        if (this.iO) {
            if (f(e, this.v)) {
                return;
            }
            Ft = this.v;
            this.v = e;
            this.cb?.(e, Ft);
            this.subs.notify(e, Ft);
        } else {
            this.v = this.o[this.k] = e;
            this.cb?.(e, Ft);
        }
    }
    useCallback(e) {
        this.cb = e;
        this.start();
        return true;
    }
    useCoercer(e, t) {
        this.A = e;
        this.C = t;
        this.start();
        return true;
    }
    subscribe(e) {
        if (this.iO === false) {
            this.start();
        }
        this.subs.add(e);
    }
    start() {
        if (this.iO === false) {
            this.iO = true;
            this.v = this.o[this.k];
            h(this.o, this.k, {
                enumerable: true,
                configurable: true,
                get: p((() => this.getValue()), {
                    getObserver: () => this
                }),
                set: e => {
                    this.setValue(e);
                }
            });
        }
        return this;
    }
    stop() {
        if (this.iO) {
            h(this.o, this.k, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: this.v
            });
            this.iO = false;
        }
        return this;
    }
}

subscriberCollection(SetterObserver);

let Ft = void 0;

const jt = new PropertyAccessor;

const Nt = /*@__PURE__*/ b("IObserverLocator", (e => e.singleton(ObserverLocator)));

const Vt = /*@__PURE__*/ b("INodeObserverLocator", (e => e.cachedCallback((e => new DefaultNodeObserverLocator))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return jt;
    }
    getAccessor() {
        return jt;
    }
}

class ObserverLocator {
    constructor() {
        this.L = [];
        this.I = o($t);
        this.M = o(Vt);
    }
    addAdapter(e) {
        this.L.push(e);
    }
    getObserver(e, t) {
        if (e == null) {
            throw createMappedError(199, t);
        }
        if (!isObject(e)) {
            return new PrimitiveObserver(e, isFunction(t) ? "" : t);
        }
        if (isFunction(t)) {
            return new ComputedObserver(e, t, void 0, this, true);
        }
        const r = getObserverLookup(e);
        let n = r[t];
        if (n === void 0) {
            n = this.createObserver(e, t);
            if (!n.doNotCache) {
                r[t] = n;
            }
        }
        return n;
    }
    getAccessor(e, t) {
        const r = e.$observers?.[t];
        if (r !== void 0) {
            return r;
        }
        if (this.M.handles(e, t, this)) {
            return this.M.getAccessor(e, t, this);
        }
        return jt;
    }
    getArrayObserver(e) {
        return getArrayObserver(e);
    }
    getMapObserver(e) {
        return getMapObserver(e);
    }
    getSetObserver(e) {
        return getSetObserver(e);
    }
    createObserver(e, t) {
        if (this.M.handles(e, t, this)) {
            return this.M.getObserver(e, t, this);
        }
        switch (t) {
          case "length":
            if (isArray(e)) {
                return getArrayObserver(e).getLengthObserver();
            }
            break;

          case "size":
            if (isMap(e)) {
                return getMapObserver(e).getLengthObserver();
            } else if (isSet(e)) {
                return getSetObserver(e).getLengthObserver();
            }
            break;

          default:
            if (isArray(e) && n(t)) {
                return getArrayObserver(e).getIndexObserver(Number(t));
            }
            break;
        }
        let r = Ht(e, t);
        if (r === void 0) {
            let n = Ut(e);
            while (n !== null) {
                r = Ht(n, t);
                if (r === void 0) {
                    n = Ut(n);
                } else {
                    break;
                }
            }
        }
        if (r !== void 0 && !l.call(r, "value")) {
            let n = this.R(e, t, r);
            if (n == null) {
                n = (r.get?.getObserver ?? r.set?.getObserver)?.(e, this);
            }
            return n == null ? r.configurable ? this._(e, t, r, true) : this.I.createProperty(e, t) : n;
        }
        return new SetterObserver(e, t);
    }
    _(e, t, r, n) {
        const i = new ComputedObserver(e, r.get, r.set, this, !!n);
        h(e, t, {
            enumerable: r.enumerable,
            configurable: true,
            get: p((() => i.getValue()), {
                getObserver: () => i
            }),
            set: e => {
                i.setValue(e);
            }
        });
        return i;
    }
    R(e, t, r) {
        if (this.L.length > 0) {
            for (const n of this.L) {
                const i = n.getObserver(e, t, r, this);
                if (i != null) {
                    return i;
                }
            }
        }
        return null;
    }
}

const getCollectionObserver = e => {
    let t;
    if (isArray(e)) {
        t = getArrayObserver(e);
    } else if (isMap(e)) {
        t = getMapObserver(e);
    } else if (isSet(e)) {
        t = getSetObserver(e);
    }
    return t;
};

const Ut = Object.getPrototypeOf;

const Ht = Object.getOwnPropertyDescriptor;

const getObserverLookup = e => {
    let t = e.$observers;
    if (t === void 0) {
        h(e, "$observers", {
            enumerable: false,
            value: t = createLookup()
        });
    }
    return t;
};

const Kt = /*@__PURE__*/ b("IObservation", (e => e.singleton(Observation)));

class Observation {
    static get inject() {
        return [ Nt ];
    }
    constructor(e) {
        this.oL = e;
        this.B = {
            immediate: true
        };
    }
    run(e) {
        const t = new RunEffect(this.oL, e);
        t.run();
        return t;
    }
    watch(e, t, r, n = this.B) {
        let i = undefined;
        let o = false;
        const a = this.oL.getObserver(e, t);
        const c = {
            handleChange: (e, t) => r(e, i = t)
        };
        const run = () => {
            if (o) return;
            r(a.getValue(), i);
        };
        const stop = () => {
            o = true;
            a.unsubscribe(c);
        };
        a.subscribe(c);
        if (n.immediate) {
            run();
        }
        return {
            run: run,
            stop: stop
        };
    }
}

class RunEffect {
    constructor(e, t) {
        this.oL = e;
        this.fn = t;
        this.maxRunCount = 10;
        this.queued = false;
        this.running = false;
        this.runCount = 0;
        this.stopped = false;
    }
    handleChange() {
        this.queued = true;
        this.run();
    }
    handleCollectionChange() {
        this.queued = true;
        this.run();
    }
    run() {
        if (this.stopped) {
            throw createMappedError(225);
        }
        if (this.running) {
            return;
        }
        ++this.runCount;
        this.running = true;
        this.queued = false;
        ++this.obs.version;
        try {
            enterConnectable(this);
            this.fn(this);
        } finally {
            this.obs.clear();
            this.running = false;
            exitConnectable(this);
        }
        if (this.queued) {
            if (this.runCount > this.maxRunCount) {
                this.runCount = 0;
                throw createMappedError(226);
            }
            this.run();
        } else {
            this.runCount = 0;
        }
    }
    stop() {
        this.stopped = true;
        this.obs.clearAll();
    }
}

connectable(RunEffect);

function getObserversLookup(e) {
    if (e.$observers === void 0) {
        h(e, "$observers", {
            value: {}
        });
    }
    return e.$observers;
}

const zt = {};

function observable(e, t, r) {
    if (!SetterNotifier.mixed) {
        SetterNotifier.mixed = true;
        subscriberCollection(SetterNotifier);
    }
    if (t == null) {
        return (t, r, n) => deco(t, r, n, e);
    }
    return deco(e, t, r);
    function deco(e, t, r, n) {
        const i = t === void 0;
        n = typeof n !== "object" ? {
            name: n
        } : n || {};
        if (i) {
            t = n.name;
        }
        if (t == null || t === "") {
            throw createMappedError(224);
        }
        const o = n.callback || `${w(t)}Changed`;
        let a = zt;
        if (r) {
            delete r.value;
            delete r.writable;
            a = r.initializer?.();
            delete r.initializer;
        } else {
            r = {
                configurable: true
            };
        }
        if (!("enumerable" in r)) {
            r.enumerable = true;
        }
        const c = n.set;
        r.get = function g() {
            const e = getNotifier(this, t, o, a, c);
            currentConnectable()?.subscribeTo(e);
            return e.getValue();
        };
        r.set = function s(e) {
            getNotifier(this, t, o, a, c).setValue(e);
        };
        r.get.getObserver = function gO(e) {
            return getNotifier(e, t, o, a, c);
        };
        if (i) {
            h(e.prototype, t, r);
        } else {
            return r;
        }
    }
}

function getNotifier(e, t, r, n, i) {
    const o = getObserversLookup(e);
    let a = o[t];
    if (a == null) {
        a = new SetterNotifier(e, r, i, n === zt ? void 0 : n);
        o[t] = a;
    }
    return a;
}

class SetterNotifier {
    constructor(e, t, r, n) {
        this.type = te;
        this.v = void 0;
        this.ov = void 0;
        this.o = e;
        this.S = r;
        this.hs = isFunction(r);
        const i = e[t];
        this.cb = isFunction(i) ? i : void 0;
        this.v = n;
    }
    getValue() {
        return this.v;
    }
    setValue(e) {
        if (this.hs) {
            e = this.S(e);
        }
        if (!f(e, this.v)) {
            this.ov = this.v;
            this.v = e;
            this.cb?.call(this.o, this.v, this.ov);
            e = this.ov;
            this.ov = this.v;
            this.subs.notify(this.v, e);
        }
    }
}

SetterNotifier.mixed = false;

function nowrap(e, t) {
    if (e == null) {
        return (e, t) => deco(e, t);
    } else {
        return deco(e, t);
    }
    function deco(e, t) {
        const r = !t;
        if (r) {
            defineHiddenProp(e, Pt, true);
        } else {
            defineHiddenProp(e.constructor, `${It}_${w(t)}__`, true);
        }
    }
}

const Gt = b("ISignaler", (e => e.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = createLookup();
    }
    dispatchSignal(e) {
        const t = this.signals[e];
        if (t === undefined) {
            return;
        }
        let r;
        for (r of t.keys()) {
            r.handleChange(undefined, undefined);
        }
    }
    addSignalListener(e, t) {
        var r;
        ((r = this.signals)[e] ?? (r[e] = new Set)).add(t);
    }
    removeSignalListener(e, t) {
        this.signals[e]?.delete(t);
    }
}

export { AccessBoundaryExpression, AccessGlobalExpression, AccessKeyedExpression, AccessMemberExpression, AccessScopeExpression, AccessThisExpression, ne as AccessorType, ArrayBindingPattern, ArrayIndexObserver, ArrayLiteralExpression, ArrayObserver, ArrowFunction, AssignExpression, BinaryExpression, BindingBehaviorExpression, BindingContext, BindingIdentifier, BindingObserverRecord, CallFunctionExpression, CallMemberExpression, CallScopeExpression, CollectionLengthObserver, CollectionSizeObserver, ComputedObserver, ConditionalExpression, kt as ConnectableSwitcher, CustomExpression, DestructuringAssignmentExpression, DestructuringAssignmentRestExpression, DestructuringAssignmentSingleExpression, DirtyCheckProperty, Dt as DirtyCheckSettings, DirtyChecker, ForOfStatement, Z as ICoercionConfiguration, $t as IDirtyChecker, Ne as IExpressionParser, Vt as INodeObserverLocator, Kt as IObservation, Nt as IObserverLocator, Gt as ISignaler, Interpolation, MapObserver, ObjectBindingPattern, ObjectLiteralExpression, Observation, ObserverLocator, PrimitiveLiteralExpression, PrimitiveObserver, PropertyAccessor, Bt as ProxyObservable, Scope, SetObserver, SetterObserver, SubscriberRecord, TaggedTemplateExpression, TemplateExpression, UnaryExpression, Unparser, ValueConverterExpression, astAssign, astBind, astEvaluate, astUnbind, astVisit, batch, cloneIndexMap, connectable, copyIndexMap, createIndexMap, disableArrayObservation, disableMapObservation, disableSetObservation, enableArrayObservation, enableMapObservation, enableSetObservation, getCollectionObserver, getObserverLookup, isIndexMap, nowrap, observable, parseExpression, subscriberCollection };
//# sourceMappingURL=index.mjs.map
