import { Parser } from "../parser";

export function parseTerm(parser: Parser, stopat = false) {
    let left = parser.parseFactor();
    while (true) {
        const token = parser.peek();
        if (stopat && token && (token.value === "+" || token.value === "-") && parser.peek(1)?.type === "ParenClose") {
            break;
        }

        if (!token || token.type !== "Operator" || (token.value !== "+" && token.value !== "-")) {
            break;
        }

        parser.next();
        const right = parser.parseFactor();

        left = {
            type: "BinaryExpression",
            operator: token.value,
            left,
            right,
        };
    }

    return left;
}
