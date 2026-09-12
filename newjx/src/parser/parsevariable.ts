import { Parser } from "../parser/parser";
import { VariableDeclarationNode } from "../ast/node";

export function parseVariable(parser: Parser): VariableDeclarationNode {
    const keyword = parser.expect("Keyword");

    let varType: string | undefined;
    let typeTokenPosition: number | undefined;
    let array: { elementType?: string; length?: number } | undefined;

    if (parser.peek()?.type === "Type") {
        const typeToken = parser.next();
        varType = typeToken.value;
        typeTokenPosition = typeToken.position;
    }

    if (parser.peek()?.type === "BracketOpen") {
        const open = parser.next();
        let length: number | undefined;

        if (parser.peek()?.type === "NumberLiteral") {
            length = Number(parser.next().value);
        }

        const close = parser.expect("BracketClose");
        const next = parser.peek();

        if (!next || next.type !== "Identifier") {
            throw new Error("배열 이름이 필요합니다.");
        }

        const typeAndBracketConnected =
            typeTokenPosition !== undefined &&
            open.position === typeTokenPosition + (varType?.length ?? 0);

        const bracketAndNameConnected =
            next.position === close.position + close.value.length;

        if (!varType && !bracketAndNameConnected) {
            throw new Error("타입 추론 배열에서는 []와 변수명 사이에 공백을 사용할 수 없습니다.");
        }

        if (varType && !typeAndBracketConnected && bracketAndNameConnected) {
            throw new Error("명시 타입 배열에서는 타입과 [] 사이에 공백이 있으면 변수명도 띄워야 합니다.");
        }

        array = {
            elementType: varType,
            length,
        };
    }

    const name = parser.expect("Identifier");
    parser.expect("Operator", "=");

    const value = parser.parseExpression();
    parser.expect("Punctuation", ";");

    return {
        type: "VariableDeclaration",
        mutable: keyword.value === "mut",
        varType,
        array,
        name: name.value,
        value,
    };
}
