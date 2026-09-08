import type { ForStatementNode } from '../../ast/node';
import type { Parser } from '../parser';
import { parseForCondition } from '../util/parseForcond';

export function parseFor(parser: Parser): ForStatementNode {
    parser.expect("Keyword", "for");
    parser.expect("ParenOpen");

    const type = parser.expect("Type");
    const name = parser.expect("Identifier");

    parser.expect("Operator", "=");
    const value = parser.parseExpression();
    parser.expect("Punctuation", ":");

    const test = parseForCondition(parser);
    const update = parser.peek();

    if (!update || update.type !== "Operator" || update.value !== "+" && update.value !== "-") {
        throw new Error("for문의 증감 연산자는 + 또는 -여야 합니다.");
    }

    parser.next();
    parser.expect("ParenClose");

    const body = parser.parseBlock();
    return {
        type: "ForStatement",
        init: {
            type: "VariableDeclaration",
            mutable: true,
            varType: type.value,
            name: name.value,
            value,
        },
        test,
        updateOperator: update.value as "+" | "-",
        iteratorName: name.value,
        body,
    };
}