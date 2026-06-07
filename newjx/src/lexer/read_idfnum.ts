import { BOOLEANS, KEYWORDS, TYPES } from "./keyword";
import { Token } from "./tokens";

export function readIdentifier(
    source: string,
    tokens: Token[],
    current: number,
): number {
    const start = current;
    while (current < source.length && /[a-zA-Z0-9_]/.test(source[current])) {
        current++;
    }

    const word = source.slice(start, current);
    if (KEYWORDS.has(word)) {
        tokens.push({
            type: "Keyword",
            value: word,
            position: start,
        });
    } else if (TYPES.has(word)) {
        tokens.push({
            type: "Type",
            value: word,
            position: start,
        });
    } else if (BOOLEANS.has(word)) {
        tokens.push({
            type: "BooleanLiteral",
            value: word,
            position: start,
        });
    } else {
        tokens.push({
            type: "Identifier",
            value: word,
            position: start,
        });
    }

    return current;
}

export function readNumber(
    source: string,
    tokens: Token[],
    current: number,
): number {
    const start = current;
    while (current < source.length && /\d/.test(source[current])) {
        current++;
    }

    tokens.push({
        type: "NumberLiteral",
        value: source.slice(start, current),
        position: start,
    });

    return current;
}
