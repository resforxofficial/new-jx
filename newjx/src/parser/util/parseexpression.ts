import { ExpressionNode } from '../../ast/node';
import type { Parser } from '../parser';
import { parseEquality } from './parserequality';

export function parseExpression(parser: Parser): ExpressionNode {
    return parseEquality(parser);
}
