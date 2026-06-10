import { ExpressionNode } from "../../ast/node";
import { Parser } from "../parser";

export function parseComparison(parser: Parser): ExpressionNode {
    let left = parser.parseTerm();
    while (true) {
        const token = parser.peek();
        if (
            !token ||
            token.type !== "Operator" ||
            (token.value !== "<" &&
                token.value !== ">" &&
                token.value !== "<=" &&
                token.value !== ">=")
        ) {
            break;
        }

        parser.next();
        const right = parser.parseTerm();

        left = {
            type: "BinaryExpression",
            operator: token.value,
            left,
            right,
        };
    }

    return left;
}
