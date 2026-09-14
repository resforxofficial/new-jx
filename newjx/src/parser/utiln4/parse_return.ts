import type { ReturnStatementNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseReturn(parser: Parser): ReturnStatementNode {
    parser.expect("Keyword", "return");
    const value = parser.parseExpression();
    parser.expect("Punctuation", ";");

    return {
        type: "ReturnStatement",
        value,
    };
}
