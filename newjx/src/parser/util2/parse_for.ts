import type { ForOfStatementNode, ForStatementNode } from '../../ast/node';
import type { Parser } from '../parser';
import { parseForCondition } from '../util/parseForcond';

export function parseFor(parser: Parser): ForStatementNode | ForOfStatementNode {
    parser.expect("Keyword", "for");
    parser.expect("ParenOpen");

    let varType: string | undefined;
    let name;

    if (parser.peek()?.type === "Type") {
        varType = parser.next().value;
        name = parser.expect("Identifier");
    } else {
        name = parser.expect("Identifier");
    }

    if (parser.peek()?.type === "Punctuation" && parser.peek()?.value === ":") {
        parser.next();

        const iterable = parser.parseExpression();
        parser.expect("ParenClose");
        const body = parser.parseBlock();

        return {
            type: "ForOfStatement",
            varType,
            iteratorName: name.value,
            iterable,
            body,
        };
    }

    if (!varType) {
        throw new Error("일반 for문에서는 반복 변수의 타입이 필요합니다.");
    }

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
            varType,
            name: name.value,
            value,
        },
        test,
        updateOperator: update.value as "+" | "-",
        iteratorName: name.value,
        body,
    };
}
