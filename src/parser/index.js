import terms from '../terms';
const {
    ParenGroup,
    Lambda,
    NameRefTerm,
    ChurchNumber
} = terms;

class Token {
    constructor(type) {
        this.type = type;
    }
    is(token) {
        return this.type === token.type;
    }
    toString() {
        return `<token ${this.type}>`;
    }
}

class NameToken extends Token {
    constructor(name) {
        super('name');
        this.name = name;
    }
    toString() {
        return `<name "${this.name}">`;
    }
}

class NumberToken extends Token {
    constructor(n) {
        super('number');
        this.n = n;
    }
    toString() {
        return `<number "${this.n}">`;
    }
}

const TOKEN_LAMDA = new Token('lambda')
    , TOKEN_DOT = new Token('dot')
    , TOKEN_PAREN_OPEN = new Token('paren_open')
    , TOKEN_PAREN_CLOSE = new Token('paren_close')
    , TOKEN_NUMBER = new NumberToken(0)
    , TOKEN_NAME = new NameToken('')
    , TOKEN_END = new Token('end')
    ;

const map = {
    '\\': TOKEN_LAMDA,
    '.': TOKEN_DOT,
    '(': TOKEN_PAREN_OPEN,
    ')': TOKEN_PAREN_CLOSE
};

const spaceChars = ' \n\t'.split('');

export default class Parser {
    constructor() {
        this.tokens = [];
        this.buffer = [];
        this.ast = null;
    }

    tokenize(str) {
        this.tokens = [];
        this.buffer = [];
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (this.isNameChar(c)) {
                this.buffer.push(c);
                continue;
            } else {
                this.flushBuffer();
                if (c in map) {
                    this.tokens.push(map[c]);
                    continue;
                }
                if (this.isSpace(c)) continue;
                throw new TypeError('Unexpected character "' + c + '"');
            }
        }
        this.flushBuffer();
        this.tokens.push(TOKEN_END);
        return this.tokens;
    }

    flushBuffer() {
        if (this.buffer.length) {
            let token = null;
            const buffer = this.buffer.join('');
            if ((/[0-9]/).test(this.buffer[0])) {
                token = new NumberToken(Number.parseInt(buffer));
            } else {
                token = new NameToken(buffer);
            }
            this.tokens.push(token);
            this.buffer = [];
        }
    }

    isNameChar(c) {
        return (/[A-Za-z0-9_]/).test(c);
    }

    isSpace(c) {
        return spaceChars.includes(c);
    }

    buildAst() {
        this.ast = [];
        while (this.tokens.length) {
            this.consumeNext();
        }
        return this.ast;
    }

    shift() {
        return this.tokens.shift();
    }

    consumeNext() {
        const token = this.tokens[0];
        if (token.is(TOKEN_LAMDA)) {
            this.ast.push(this.consumeLambda());
            return;
        }
        if (token.is(TOKEN_NAME)) {
            this.ast.push(this.consumeNameRef());
            return;
        }
        if (token.is(TOKEN_NUMBER)) {
            this.ast.push(this.consumeNumber());
            return;
        }
        if (token.is(TOKEN_PAREN_OPEN)) {
            this.ast.push(this.consumeParens());
            return;
        }
        if (token.is(TOKEN_END)) {
            this.shift();
            return;
        }
        throw new TypeError('Unexpected token: ' + this.tokens.join(' '));
    }

    consumeLambda() {
        this.shift(); // '\'

        const args = [];

        let next = this.shift();
        while (next.is(TOKEN_NAME)) {
            args.push(next.name);
            next = this.shift();
        }
        if (!next.is(TOKEN_DOT)) {
            throw new TypeError('Unexpected token in lambda! ' + [next].concat(this.tokens).join(' '));
        }

        const child = new Parser();
        child.tokens = this.tokens;

        const body = child.buildAst();
        return new Lambda(args, body);
    }

    consumeNameRef() {
        const token = this.shift();
        return new NameRefTerm(token.name);
    }

    consumeNumber() {
        const token = this.shift();
        return new ChurchNumber(token.n);
    }

    consumeParens() {
        this.shift(); // '('
        const body = this.consumeSubLevel();
        return new ParenGroup(body);
    }

    consumeSubLevel() {
        const child = new Parser();
        const tokens = [];
        
        let level = 1;
        while (level > 0) {
            const next = this.shift();
            if (next.is(TOKEN_PAREN_OPEN)) {
                level++;
            } else if (next.is(TOKEN_PAREN_CLOSE)) {
                level--;
            } else if (next.is(TOKEN_END)) {
                throw new TypeError('Unexpected end of input');
            }
            if (level > 0)
                tokens.push(next);
        }
        child.tokens = tokens;
        const body = child.buildAst();
        return body;
    }
}
