import type { ExpressionNode } from '../../ast/node';
import { Parser } from '../parser';

export function parsePrimary(parser: Parser): ExpressionNode {
    const token = parser.peek();
    switch (token.type) {
        case "NumberLiteral":
            parser.next();
            return {
                type: "Literal",
                value: Number(token.value),
            };
        case "StringLiteral":
            parser.next();
            return {
                type: "Literal",
                value: token.value,
            };
        case "BooleanLiteral":
            parser.next();
            return {
                type: "Literal",
                value: token.value === "true",
            };
        case "Identifier":
            parser.next();
            return {
                type: "Identifier",
                name: token.value
            };
        
        default:
            throw new Error(`예상하지 못한 토큰입니다: ${token.value}`);
    }
}