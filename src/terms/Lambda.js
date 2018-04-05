import NestedTerm from './NestedTerm';
import NameRefTerm from './NameRefTerm';
import ParenGroup from './ParenGroup'

export default class Lambda extends NestedTerm {
    constructor(args, body) {
        super('lambda', body);
        this.args = args;
    }

    replace(name, term) {
        if (!this.args.includes(name)) {
            super.replace(name, term);
        }
    }

    replaceAll(values) {
        for (let i = 0; i < values.length; i++) {
            super.replace(this.args[i], values[i]);
        }
    }

    partialApply(values) {
        const newArgs = this.args.slice(values.length);
        const result = new Lambda(this.args, this.body);
        result.replaceAll(values);
        result.args = newArgs;
        return result;
    }

    fullApply(values) {
        this.replaceAll(values);
        return new ParenGroup(this.body);
    }

    applyTo(stack) {
        const argValues = stack.consume(this.args.length);

        if (argValues.length < this.args.length) {
            return this.partialApply(argValues);
        } else {
            return this.fullApply(argValues);
        }
    }

    toString() {
        const args = this.args.join(' ');
        return `(\\${args}. ${super.toString()})`;
    }

    simplify() {
        let result = this;
        if (this.body.length === 1 && this.body[0] instanceof ParenGroup) {
            const newBody = this.body[0].simplify() || this.body[0];
            result = new Lambda(this.args, newBody.body);
        }
        for (let i = 0; i < Lambda.simplifiers.length; i++) {
            if (!(result instanceof Lambda)) break;
            const TermClass = Lambda.simplifiers[i];
            const maybeResult = TermClass.simplify(result);
            if (maybeResult !== null) {
                result = maybeResult.simplify() || maybeResult;
            }
        }
        return result === this? null : result;
    }
}
Lambda.simplifiers = [];
Lambda.registerSimplifier = function (TermClass) {
    this.simplifiers.push(TermClass);
};

Lambda.simplify = lambda => {
    // eta-reduction
    
    if (lambda.args.length + 1 > lambda.body.length) return null;

    const headLength = lambda.body.length - lambda.args.length;
    const bodyTail = lambda.body.slice(headLength);

    for (let i = 0; i < lambda.args.length; i++) {
        const name = lambda.args[i];
        if (bodyTail[i] instanceof NameRefTerm && bodyTail[i].name === name) {
            continue;
        } else {
            return null;
        }
    }
    const result = new ParenGroup(lambda.body.slice(0, headLength));
    return result.simplify() || result;
};
Lambda.registerSimplifier(Lambda);
