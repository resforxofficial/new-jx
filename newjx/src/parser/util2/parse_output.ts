import type { ExpressionNode, OutputStatementNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseOutput(parser: Parser): OutputStatementNode {
    parser.expect("Keyword", "out");
    const expressions: ExpressionNode[] = [];
    expressions.push(parser.parseExpression());

    while (true) {
        const token = parser.peek();
        if (!token || token.type !== "Punctuation" || token.value !== ",") {
            break;
        }

        parser.next();
        expressions.push(parser.parseExpression());
    }
    parser.expect("Punctuation", ";");

    return {
        type: "OutputStatement",
        expressions,
    };
}