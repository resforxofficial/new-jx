import type { BreakStatementNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseBreak(parser: Parser): BreakStatementNode {
    parser.expect("Keyword", "break");
    parser.expect("Punctuation", ";");

    return {
        type: "BreakStatement",
    };
}
