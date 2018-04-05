const expr = '\x. succ ((\x. x) x)';

class Token {
    constructor(type) {
        this.type = type;
    }
    equals(token) {
        return this.type === token.type;
    }
}

class NameToken extends Token {
    constructor(name) {
        super('name');
        this.name = name;
    }
    equals(token) {
        return super.equals(token) && token.name === this.name;
    }
}

const TOKEN_LAMDA = new Token('lambda')
    , TOKEN_DOT = new Token('dot')
    , TOKEN_PAREN_OPEN = new Token('paren_open')
    , TOKEN_PAREN_CLOSE = new Token('paren_close')
    ;

const map = {
    '\\': TOKEN_LAMDA,
    '.': TOKEN_DOT,
    '(': TOKEN_PAREN_OPEN,
    ')': TOKEN_PAREN_CLOSE
};

const spaceChars = ' \n\t'.split('');

class Parser {
    tokenize(str) {
        this.tokens = [];
        this.buffer = [];
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (this.isSpace(c)) {
                this.flushBuffer();
                continue;
            }
            if (this.isNameChar(c)) {
                this.buffer.push(c);
                continue;
            }
            if (c in map) {
                this.tokens.push(map[c]);
                continue;
            }
            throw new TypeError('Unexpected character ' + c);
        }
        this.flushBuffer();
        return this.tokens;
    }

    flushBuffer() {
        if (this.buffer.length) {
            this.tokens.push(new NameToken(buffer.join('')));
            this.buffer = [];
        }
    }

    isNameChar(c) {
        return c.test(/[A-Za-z_]/);
    }

    isSpace(c) {
        return spaceChars.includes(c);
    }

    buildAst() {
        
    }
}
