import Term from './Term';
import NestedTerm from './NestedTerm';
import NameRefTerm from './NameRefTerm';
import ParenGroup from './ParenGroup';
import Lambda from './Lambda';

export default class ChurchNumber extends Term {
    constructor(n) {
        super('number');
        this.n = n;
    }

    applyTo(stack) {
        if (stack.body.length >= 2) {
            const f = stack.consumeHead();
            const x = stack.consumeHead();
            let result = x; // 0 = \f x. x
            for (let i = 0; i < this.n; i++) {
                // 1 = \f x. f x
                result = f.applyTo(new NestedTerm('temp', [result]));
            }
            return result;
        }
        return this;
    }

    toString() {
        return this.n + '';
    }
}
ChurchNumber.simplify = lambda => {
    if (lambda.args.length !== 2) return null;
    const [f, x] = lambda.args;
    
    if (lambda.body.length === 1) {
        const theOnly = lambda.body[0];
        if (theOnly instanceof NameRefTerm && theOnly.name === x) {
            return new ChurchNumber(0);
        }
    }

    if (lambda.body.length !== 2) return null;

    let i = 1;
    let [fn, arg] = lambda.body;
    while (true) {
        if (!(fn instanceof NameRefTerm && fn.name === f)) return null;
        if (arg instanceof ParenGroup) {
            if (arg.body.length === 2) {
                [fn, arg] = arg.body;
                i++;
                continue;
            } else {
                return null;
            }
        }
        else if (arg instanceof NameRefTerm && arg.name === x) {
            return new ChurchNumber(i);
        } else {
            return null;
        }
    }
};
Lambda.registerSimplifier(ChurchNumber);
