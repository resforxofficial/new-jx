import type { VariableDeclarationNode } from "../ast/node";
import type { Scope } from "./main";
import { getExpressionType } from "./util/expression";

export function validateVariable(
    node: VariableDeclarationNode,
    scope: Scope,
): void {
    if (scope.declared.has(node.name)) {
        throw new Error(`이미 선언된 변수입니다: ${node.name}`);
    }

    if (!node.value) {
        throw new Error(`변수의 초기값이 필요합니다: ${node.name}`);
    }

    const actualType = getExpressionType(node.value, scope);

    if (node.varType && node.varType !== actualType) {
        throw new Error(
            `변수 타입이 일치하지 않습니다: ${node.name} (${node.varType} ← ${actualType})`,
        );
    }

    const type = node.varType ?? actualType;

    scope.declared.set(node.name, type);

    if (node.mutable) {
        scope.mutable.add(node.name);
    }
    scope.initialized.add(node.name);
}
