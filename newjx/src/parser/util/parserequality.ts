import type { ExpressionNode } from '../../ast/node';
import type { Parser } from "../parser";

export function parseEquality(parser: Parser): ExpressionNode {
    let left = parser.parseComparison();
    while (true) {
        const token = parser.peek();
        if (!token || token.type !== "Operator" || (token.value !== "==" && token.value !== "!=")) {
            break;
        }

        parser.next();
        const right = parser.parseComparison();

        left = {
            type: "BinaryExpression",
            operator: token.value,
            left,
            right,
        };
    }

    return left;
}
