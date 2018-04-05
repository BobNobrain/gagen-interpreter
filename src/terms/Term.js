export default class Term {
    constructor(type) {
        this.type = type;
    }

    apply() {
        return this;
    }

    applyTo() {
        return this;
    }

    simplify() {
        return null;
    }

    toString() {
        return `<term ${this.type}>`;
    }

    show() {
        console.log(this.toString());
    }
}
