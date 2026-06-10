import { ExpressionNode } from "../../ast/node";
import { Parser } from "../parser";

export function parseFactor(parser: Parser): ExpressionNode {
    let left = parser.parsePrimary();
    while (true) {
        const token = parser.peek();
        if (!token || token.type !== "Operator" || (token.value !== "*" && token.value !== "/")) {
            break;
        }

        parser.next();
        const right = parser.parsePrimary();

        left = {
            type: "BinaryExpression",
            operator: token.value,
            left,
            right,
        };
    }

    return left;
}