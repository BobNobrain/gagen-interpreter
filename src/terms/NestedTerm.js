import Term from './Term';
import NameRefTerm from './NameRefTerm';

export default class NestedTerm extends Term {
    constructor(type, body) {
        super(type);
        this.body = body;
    }

    replace(name, withTerm) {
        for (let i = 0; i < this.body.length; i++) {
            const term = this.body[i];
            if (term instanceof NameRefTerm) {
                if (name === term.name) {
                    this.body[i] = withTerm;
                }
            } else if (term instanceof NestedTerm) {
                term.replace(name, withTerm);
            }
        }
    }

    apply() {
        // console.log(`Applying self ${this}`);
        const head = this.consumeHead();
        // console.log(`Applying ${head} to [${this}]`);
        const result = head.applyTo(this);
        this.pushBack(result);
        for (let i = 0; i < this.body.length; i++) {
            const term = this.body[i];
            const result = term.apply();
            this.body[i] = result;
        }
        return this;
    }

    simplify() {
        for (let i = 0; i < this.body.length; i++) {
            const term = this.body[i];
            const result = term.simplify();
            if (result !== null) {
                this.body[i] = result;
            }
        }
        return null;
    }

    consume(n) {
        const result = this.body.slice(0, n);
        this.body = this.body.slice(n);
        return result;
    }

    consumeHead() {
        return this.body.shift();
    }

    pushBack(term) {
        this.body.unshift(term);
    }

    toString() {
        return this.body.join(' ');
    }
}
