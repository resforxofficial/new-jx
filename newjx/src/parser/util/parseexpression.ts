import { ExpressionNode } from '../../ast/node';
import type { Parser } from '../parser';
import { parsePrimary } from './parseprimary';

export function parseExpression(parser: Parser): ExpressionNode {
    return parsePrimary(parser);
}