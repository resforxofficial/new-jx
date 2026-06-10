import { ExpressionNode } from '../../ast/node';
import type { Parser } from '../parser';
import { parseComparison } from './parsecomparison';

export function parseExpression(parser: Parser): ExpressionNode {
    return parseComparison(parser);
}
