import Term from './Term';
import NameRefTerm from './NameRefTerm';
import Lambda from './Lambda';


export default class Pair extends Term {
    constructor(x, y) {
        super('pair');
        this.fst = x;
        this.snd = y;
    }

    applyTo(stack) {
        const f = stack.consumeHead();
        return f.applyTo(this.fst, this.snd);
    }

    toString() {
        return `<pair [${this.fst}] [${this.snd}]>`;
    }
}
Pair.simplify = lambda => {
    console.log(lambda);
    if (lambda.args.length > 3) return null;
    if (lambda.body.length !== 3) return null;
    const fnName = lambda.args[lambda.args.length - 1];
    const candidate = lambda.body[0];
    if (!(candidate instanceof NameRefTerm && candidate.name === fnName)) return null;

    if (lambda.args.length === 2) {
        // \y z. z x y
        const y = lambda.body[2];
        if (!(y instanceof NameRefTerm && y.name === lambda.args[0])) return null;
    }
    if (lambda.args.length === 3) {
        // \x y z. z x y
        const x = lambda.body[1];
        const y = lambda.body[2];
        if (!(x instanceof NameRefTerm && x.name === lambda.args[0])) return null;
        if (!(y instanceof NameRefTerm && y.name === lambda.args[1])) return null;
    }
    return new Pair(lambda.body[1], lambda.body[2]);
};
Lambda.registerSimplifier(Pair);
