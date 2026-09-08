import { Parser } from '../parser/parser';
import { VariableDeclarationNode } from '../ast/node';

export function parseVariable(parser: Parser): VariableDeclarationNode {
    const keyword = parser.expect("Keyword");

    let varType: string | undefined;

    if (parser.peek().type === "Type") {
        varType = parser.next().value;
    }

    const name = parser.expect("Identifier");

    parser.expect("Operator", "=");
    const value = parser.parseExpression();

    parser.expect("Punctuation", ";");

    return {
        type: "VariableDeclaration",
        mutable: keyword.value === "mut",
        varType,
        name: name.value,
        value,
    };
}