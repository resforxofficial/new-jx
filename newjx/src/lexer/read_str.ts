import type { Token } from './tokens';

export function readString(source: string, tokens: Token[], current: number): number {
    const start = current;
    current++;

    let value = "";
    while (current < source.length && source[current] !== '"') {
        value += source[current];
        current++;
    }

    if (current >= source.length) {
        throw new Error("닫히지 않은 문자열입니다.");
    }

    current++;
    tokens.push({ type: "StringLiteral", value, position: start });
    return current;
}