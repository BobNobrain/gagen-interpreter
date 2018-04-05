import NestedTerm from './NestedTerm';

export default class ParenGroup extends NestedTerm {
    constructor(body) {
        super('paren');
        this.body = body;
    }

    simplify() {
        if (this.body.length === 1) {
            return this.body[0].simplify() || this.body[0];
        } else {
            return super.simplify();
        }
    }

    toString() {
        return `( ${super.toString()} )`;
    }
}
