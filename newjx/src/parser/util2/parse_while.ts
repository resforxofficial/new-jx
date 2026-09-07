import type { WhileStatementNode } from '../../ast/node';
import type { Parser } from '../parser';

export function parseWhile(parser: Parser): WhileStatementNode {
    parser.expect("Keyword", "while");

    const test = parser.parseExpression();
    const body = parser.parseBlock();

    return {
        type: "WhileStatement",
        test,
        body,
    };
}