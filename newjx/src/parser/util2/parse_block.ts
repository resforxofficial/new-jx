import type { ASTNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseBlock(parser: Parser): ASTNode[] {
    parser.expect("BraceOpen");
    const body: ASTNode[] = [];

    while (true) {
        const token = parser.peek();
        if (token.type === "BraceClose") {
            break;
        }

        body.push(parser.parseStatement());
    }
    parser.expect("BraceClose");

    return body;
}