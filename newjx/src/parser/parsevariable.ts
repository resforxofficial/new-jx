import { Parser } from '../parser/parser';
import { VariableDeclarationNode } from '../ast/node';

export function parseVariable(parser: Parser): VariableDeclarationNode {
    const keyword = parser.expect("Keyword");
    const type = parser.expect("Type");
    const name = parser.expect("Identifier");

    parser.expect("Operator", "=");
    const value = parser.parseExpression();

    parser.expect("Punctuation", ";");
    return {
        type: "VariableDeclaration",
        mutable: keyword.value === "mut",
        varType: type.value,
        name: name.value,
        value,
    };
}
