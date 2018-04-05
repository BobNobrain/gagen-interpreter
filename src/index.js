import terms from './terms';
const {
    NameRefTerm,
    ChurchNumber,
    ParenGroup,
    Lambda,
    Stack
} = terms;


window.stack = new Stack([
    new ParenGroup([
        new Lambda(
            ['x'],
            [
                new NameRefTerm('succ'),
                new NameRefTerm('x')
            ]
        )
    ]),
    new ChurchNumber(5)
    // new NameRefTerm('succ'),
    // new ChurchNumber(1)
]);

window.context = {
    succ: new Lambda(
        ['n', 'f', 'x'],
        [
            new NameRefTerm('f'),
            new ParenGroup([
                new NameRefTerm('n'),
                new NameRefTerm('f'),
                new NameRefTerm('x')
            ])
        ]
    )
};

window.prepare = () => {
    const context = window.context;
    const stack = window.stack;

    for (let name in context) {
        stack.replace(name, context[name]);
    }

    stack.simplify();
};
window.doStep = () => {
    const stack = window.stack;

    stack.apply();
    stack.simplify();
};

window.start = (limit = 20) => {
    const stack = window.stack;

    stack.show();
    window.prepare();
    stack.show();

    let oldS = stack.toString();
    let newS = oldS;
    let i = 0;
    do {
        i++;
        if (i >= limit) {
            console.log('Terminated by limit');
            break;
        }

        window.doStep();
        oldS = newS;
        newS = stack.toString();
        console.log(newS);
    } while (oldS !== newS)
};

window.terms = terms;
window.start(10);
