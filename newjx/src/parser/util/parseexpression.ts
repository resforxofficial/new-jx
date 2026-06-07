import type { Parser } from '../parser';
import { parsePrimary } from './parseprimary';

export function parseExpression(parser: Parser) {
    return parsePrimary(parser);
}