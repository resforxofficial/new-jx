import type { ExpressionNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseUnary(parser: Parser): ExpressionNode {
    const token = parser.peek();

    if (
        token?.type === "Operator" &&
        (token.value === "+" || token.value === "-" || token.value === "!")
    ) {
        parser.next();

        return {
            type: "UnaryExpression",
            operator: token.value,
            operand: parseUnary(parser),
        };
    }

    return parser.parsePrimary();
}
