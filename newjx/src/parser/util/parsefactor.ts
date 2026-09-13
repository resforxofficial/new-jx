import type { ExpressionNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseFactor(parser: Parser): ExpressionNode {
    let left = parser.parseUnary();

    while (true) {
        const token = parser.peek();

        if (!token || token.type !== "Operator" || (token.value !== "*" && token.value !== "/")) {
            break;
        }

        parser.next();

        const right = parser.parseUnary();

        left = {
            type: "BinaryExpression",
            operator: token.value,
            left,
            right,
        };
    }

    return left;
}
