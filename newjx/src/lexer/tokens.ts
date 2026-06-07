export type TokenType =
    | "Keyword"
    | "Type"
    | "Identifier"
    | "Operator"
    | "StringLiteral"
    | "NumberLiteral"
    | "BooleanLiteral"
    | "Punctuation"
    | "ParenOpen"
    | "ParenClose"
    | "BracketOpen"
    | "BracketClose"
    | "BraceOpen"
    | "BraceClose"
    | "Unknown";

export interface Token {
    type: TokenType;
    value: string;
    position: number;
}
