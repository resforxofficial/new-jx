import type { ArrayLiteralNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseArrayLiteral(parser: Parser): ArrayLiteralNode {
    parser.expect("BraceOpen");
    const elements = [];

    if (parser.peek()?.type !== "BraceClose") {
        elements.push(parser.parseExpression());

        while (parser.peek()?.type === "Punctuation" && parser.peek()?.value === ",") {
            parser.next();
            elements.push(parser.parseExpression());
        }
    }
    parser.expect("BraceClose");

    return {
        type: "ArrayLiteral",
        elements,
    };
}
