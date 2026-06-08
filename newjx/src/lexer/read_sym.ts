import type { Token } from "./tokens";

const SYMBOLS: Record<string, Token["type"]> = {
    "(": "ParenOpen",
    ")": "ParenClose",

    "[": "BracketOpen",
    "]": "BracketClose",

    "{": "BraceOpen",
    "}": "BraceClose",

    ";": "Punctuation",
    ":": "Punctuation",
    ".": "Punctuation",
    ",": "Punctuation",
};

export function readSymbol(
    source: string,
    tokens: Token[],
    current: number,
): number {
    const char = source[current];

    const type = SYMBOLS[char];

    if (!type) {
        throw new Error(`알 수 없는 심볼: ${char}`);
    }

    tokens.push({
        type,
        value: char,
        position: current,
    });

    return current + 1;
}
