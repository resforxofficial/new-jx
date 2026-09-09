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
        case "ParenOpen":
            parser.next();
            const expression = parser.parseExpression();
            parser.expect("ParenClose");
            return expression;
        
        case "Keyword":
            if (token.value !== "input") {
                throw new Error(`표현식에서 사용할 수 없는 키워드입니다: ${token.value}`);
            }

            parser.next();
            const prompt = parser.expect("StringLiteral");

            return {
                type: "InputExpression",
                promptText: prompt.value,
            };
        
        default:
            throw new Error(`예상하지 못한 토큰입니다: ${token.value}`);
    }
}