import type { ReturnStatementNode } from "../../ast/node";
import type { Scope } from "../main";
import { getExpressionType } from "../util/expression";

export function validateReturn(node: ReturnStatementNode, scope: Scope): void {
    let currentScope: Scope | undefined = scope;
    let functionReturnType: string | undefined;

    while (currentScope) {
        if (currentScope.functionReturnType) {
            functionReturnType = currentScope.functionReturnType;
            break;
        }

        currentScope = currentScope.parent;
    }

    if (!functionReturnType) {
        throw new Error("함수 밖에서는 return을 사용할 수 없습니다.");
    }

    if (!node.value) {
        throw new Error(
            `반환값이 필요합니다: ${functionReturnType}`
        );
    }

    if (functionReturnType === "void") {
        throw new Error("void 함수에서는 return을 사용할 수 없습니다.");
    }

    const actualType = getExpressionType(node.value, scope);

    if (
        functionReturnType !== "dynamic" &&
        actualType !== "dynamic" &&
        actualType !== functionReturnType
    ) {
        throw new Error(
            `반환값의 타입이 일치하지 않습니다: ${functionReturnType} ← ${actualType}`
        );
    }
}
