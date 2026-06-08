import { readIdentifier, readNumber } from "./read_idfnum";
import { readOperator } from "./read_oper";
import { readString } from "./read_str";
import { readSymbol } from "./read_sym";
import { Token } from "./tokens";

export function tokenize(source: string): Token[] {
    const tokens: Token[] = [];
    let current = 0;

    while (current < source.length) {
        const char = source[current];

        if (/\s/.test(char)) {
            current++;
            continue;
        }

        if (/[a-zA-Z_]/.test(char)) {
            current = readIdentifier(source, tokens, current);
            continue;
        }

        if (/\d/.test(char)) {
            current = readNumber(source, tokens, current);
            continue;
        }

        if (char === '"') {
            current = readString(source, tokens, current);
            continue;
        }
        
        if ("=+-*/!><&|".includes(char)) {
            current = readOperator(source, tokens, current);
            continue;
        }

        if ("()[]{};:,.".includes(char)) {
            current = readSymbol(source, tokens, current);
            continue;
        }

        throw new Error(`알 수 없는 문자: ${char}`);
    }

    return tokens;
}
