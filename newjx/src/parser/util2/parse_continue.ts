import { ContinueStatementNode } from '../../ast/node';
import type { Parser } from "../parser"

export function parseContinue(parser: Parser): ContinueStatementNode {
    parser.expect("Keyword", "continue");
    parser.expect("Punctuation", ";");

    return {
        type: "ContinueStatement",
    };
}
