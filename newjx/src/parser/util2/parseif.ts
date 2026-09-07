import type { ASTNode, IfStatementNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseIf(parser: Parser): IfStatementNode {
    parser.expect("Keyword", "if");

    const test = parser.parseExpression();
    const consequent = parser.parseBlock();
    let alternate: ASTNode[] | undefined;

    if (parser.peek()?.type === "Keyword" && parser.peek()?.value === "else") {
        parser.next();
        alternate = parser.parseBlock();
    }

    return {
        type: "IfStatement",
        test,
        consequent,
        alternate,
    };
}
