import type { ArrayLiteralNode, ReturnStatementNode } from "../../ast/node";
import type { Scope } from "../main";
import { getExpressionType } from "../util/expression";

export function validateReturn(node: ReturnStatementNode, scope: Scope): void {
    let currentScope: Scope | undefined = scope;
    let functionReturnType: string | undefined;
    let functionReturnArrayLength: number | undefined;

    while (currentScope) {
        if (currentScope.functionReturnType) {
            functionReturnType = currentScope.functionReturnType;
            functionReturnArrayLength = currentScope.functionReturnArrayLength;
            break;
        }

        currentScope = currentScope.parent;
    }

    if (!functionReturnType) {
        throw new Error("함수 밖에서는 return을 사용할 수 없습니다.");
    }

    if (functionReturnType === "void") {
        throw new Error("void 함수에서는 return을 사용할 수 없습니다.");
    }

    if (!node.value) {
        throw new Error(
            `반환값이 필요합니다: ${functionReturnType}`
        );
    }

    const actualType = getReturnValueType(node.value, scope);

    if (
        actualType !== "dynamic" &&
        functionReturnType !== "dynamic" &&
        actualType !== functionReturnType
    ) {
        throw new Error(
            `반환값의 타입이 일치하지 않습니다: ${functionReturnType} ← ${actualType}`
        );
    }

    if (
        functionReturnArrayLength !== undefined &&
        node.value.type === "ArrayLiteral" &&
        node.value.elements.length > functionReturnArrayLength
    ) {
        throw new Error(
            `반환 배열의 크기가 범위를 벗어났습니다: ${node.value.elements.length} (최대 ${functionReturnArrayLength})`
        );
    }
}

function getReturnValueType(node: ReturnStatementNode["value"], scope: Scope): string {
    if (!node) {
        return "void";
    }

    if (node.type !== "ArrayLiteral") {
        return getExpressionType(node, scope);
    }

    return getArrayLiteralType(node, scope);
}

function getArrayLiteralType(node: ArrayLiteralNode, scope: Scope): string {
    if (node.elements.length === 0) {
        return "dynamic[]";
    }

    const firstType = getExpressionType(node.elements[0], scope);

    for (const element of node.elements) {
        const elementType = getExpressionType(element, scope);

        if (elementType !== firstType) {
            return "dynamic[]";
        }
    }

    return `${firstType}[]`;
}
