import type { ExpressionNode } from '../../ast/node';
import type { Parser } from "../parser";

export function parseEquality(parser: Parser): ExpressionNode {
    let left = parser.parseComparison
}