import type { ReturnStatementNode } from "../../ast/node";
import type { Scope } from "../main";
import { getArrayInfo, getExpressionType } from "../util/expression";

export function validateReturn(node: ReturnStatementNode, scope: Scope): void {
    let currentScope: Scope | undefined = scope;
    let functionReturnType: string | undefined;
    let functionReturnArray;

    while (currentScope) {
        if (currentScope.functionReturnType) {
            functionReturnType = currentScope.functionReturnType;
            functionReturnArray = currentScope.functionReturnArray;
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
            `반환값이 필요합니다: ${functionReturnArray ? `${functionReturnType}[]` : functionReturnType}`,
        );
    }

    if (functionReturnArray) {
        const actualArray = getArrayInfo(node.value, scope);

        if (!actualArray) {
            throw new Error(
                `반환값은 배열이어야 합니다: ${functionReturnType}[]`,
            );
        }

        if (
            functionReturnArray.elementType &&
            functionReturnArray.elementType !== "dynamic" &&
            actualArray.elementType !== "dynamic" &&
            functionReturnArray.elementType !== actualArray.elementType
        ) {
            throw new Error(
                `반환 배열의 타입이 일치하지 않습니다: ${functionReturnType}[] ← ${actualArray.elementType}[]`,
            );
        }

        if (
            functionReturnArray.length !== undefined &&
            actualArray.initializedLength !== undefined &&
            actualArray.initializedLength > functionReturnArray.length
        ) {
            throw new Error(
                `반환 배열의 크기가 범위를 벗어났습니다: ${actualArray.initializedLength} (최대 ${functionReturnArray.length})`,
            );
        }

        functionReturnArray.initializedLength = actualArray.initializedLength;
        return;
    }

    const actualType = getExpressionType(node.value, scope);

    if (
        functionReturnType !== "dynamic" &&
        actualType !== "dynamic" &&
        actualType !== functionReturnType
    ) {
        throw new Error(
            `반환값의 타입이 일치하지 않습니다: ${functionReturnType} ← ${actualType}`,
        );
    }
}
