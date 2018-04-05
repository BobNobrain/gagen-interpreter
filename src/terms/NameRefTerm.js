import Term from './Term';

export default class NameRefTerm extends Term {
    constructor(name) {
        super('named');
        this.name = name;
    }

    toString() {
        return this.name;
    }
}
