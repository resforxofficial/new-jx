import { Parser } from '../parser';

export function parseTerm(parser: Parser) {
    let left = parser.parseFactor();
    while (true) {
        const token = parser.peek();
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