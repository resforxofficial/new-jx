import type { ExpressionNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseForCondition(parser: Parser): ExpressionNode {
    let left = parser.parseTerm(true);

    const token = parser.peek();

    if (
        token &&
        token.type === "Operator" &&
        (
            token.value === "<" ||
            token.value === ">" ||
            token.value === "<=" ||
            token.value === ">=" ||
            token.value === "==" ||
            token.value === "!="
        )
    ) {
        parser.next();

        const right = parser.parseTerm(true);

        left = {
            type: "BinaryExpression",
            operator: token.value,
            left,
            right,
        };
    }

    return left;
}