import { ExpressionNode } from '../../ast/node';
import type { Parser } from '../parser';
import { parseEquality } from './parserequality';

export function parseExpression(parser: Parser): ExpressionNode {
    const condition = parseEquality(parser);

    if (parser.peek()?.type === "Punctuation" && parser.peek()?.value === "?") {
        parser.next();

        const consequent = parseExpression(parser);

        parser.expect("Punctuation", ":");

        const alternate = parseExpression(parser);

        return {
            type: "TernaryExpression",
            condition,
            consequent,
            alternate,
        };
    }

    return condition;
}
