import NestedTerm from './NestedTerm';

export default class Stack extends NestedTerm {
    constructor(body) {
        super('stack', body);
    }

    toString() {
        return `<stack [ ${super.toString()} ]>`;
    }
}
