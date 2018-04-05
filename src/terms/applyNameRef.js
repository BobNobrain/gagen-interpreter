import NameRefTerm from './NameRefTerm';
import ParenGroup from './ParenGroup';

NameRefTerm.prototype.applyTo = function (nest) {
    if (nest instanceof ParenGroup && nest.body.length === 1) {
        return this;
    } else {
        const args = nest.consume(nest.body.length);
        const r = new ParenGroup([this].concat(args));
        return r;
    }
};
