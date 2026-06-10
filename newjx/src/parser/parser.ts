import { Token, TokenType } from '../lexer/tokens';
import { parseVariable } from './parsevariable';
import { parseExpression } from './util/parseexpression';
import { parseFactor } from './util/parsefactor';
import { parsePrimary } from './util/parseprimary';
import { parseTerm } from './util/parseterm';

export class Parser {
    private current = 0;
    constructor (private readonly token: Token[]) {}

    peek() {
        return this.token[this.current];
    }

    next() {
        return this.token[this.current++];
    }

    expect(type: TokenType, value?: string): Token {
        const token = this.peek();

        if (!token) {
            throw new Error("예상한 토큰이 존재하지 않습니다.");
        }
        if (token.type !== type) {
            throw new Error(`${type} 토큰이 필요하지만 ${token.type}을(를) 발견했습니다.`);
        }
        if (value !== undefined && token.value !== value) {
            throw new Error(`"${value}"가 필요하지만 "${token.value}"을(를) 발견했습니다.`);
        }

        return this.next();
    }

    parse() {
        const body = [];
        while (!this.isAtEnd()) {
            body.push(this.parseStatement());
        }

        return body;
    }

    isAtEnd(): boolean {
        return this.current >= this.token.length;
    }
    match() {}
    parseStatement() {
        const token = this.peek();
        if (!token) {
            throw new Error("예상하지 못한 EOF입니다.");
        }
        if (token.type === "Keyword" && (token.value === "mut" || token.value === "immut")) {
            return parseVariable(this);
        }

        throw new Error(`알 수 없는 문장입니다: ${token.value}`);
    }

    parseExpression() {
        return parseExpression(this);
    }

    parsePrimary() {
        return parsePrimary(this);
    }

    parseTerm() {
        return parseTerm(this);
    }

    parseFactor() {
        return parseFactor(this);
    }
}