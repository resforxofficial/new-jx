import type { VariableDeclarationNode } from "../ast/node";
import type { Scope } from "./main";
import { getExpressionType } from "./util/expression";

export function validateVariable(node: VariableDeclarationNode, scope: Scope): void {
    if (scope.declared.has(node.name)) {
        throw new Error(`이미 선언된 변수입니다: ${node.name}`);
    }

    if (!node.value) {
        throw new Error(`변수의 초기값이 필요합니다: ${node.name}`);
    }

    const isInput = node.value.type === "InputExpression";
    const isArray = node.value.type === "ArrayLiteral";
    const actualType = getExpressionType(node.value, scope);

    if (node.value.type === "ArrayLiteral" && node.varType && node.arrayLength !== undefined) {
        if (node.value.elements.length !== node.arrayLength) {
            throw new Error(
                `배열 길이가 일치하지 않습니다: ${node.name} (${node.arrayLength} ← ${node.value.elements.length})`
            );
        }

        for (const element of node.value.elements) {
            const elementType = getExpressionType(element, scope);

            if (elementType !== node.varType) {
                throw new Error(
                    `배열 요소의 타입이 일치하지 않습니다: ${node.name} (${node.varType} ← ${elementType})`
                );
            }
        }
    } else if (!isInput && node.varType && node.varType !== actualType) {
        throw new Error(
            `변수 타입이 일치하지 않습니다: ${node.name} (${node.varType} ← ${actualType})`
        );
    }

    const type = node.varType ?? actualType;
    scope.declared.set(node.name, type);

    if (node.mutable) {
        scope.mutable.add(node.name);
    }

    scope.initialized.add(node.name);
}
