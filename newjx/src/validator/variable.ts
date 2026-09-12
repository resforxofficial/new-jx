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

    if (node.array) {
        if (node.value.type !== "ArrayLiteral") {
            throw new Error(`배열 변수에는 배열 리터럴이 필요합니다: ${node.name}`);
        }

        const elements = node.value.elements;

        if (node.array.length !== undefined && elements.length > node.array.length) {
            throw new Error(
                `배열 크기를 초과했습니다: ${node.name} (${node.array.length} ← ${elements.length})`
            );
        }

        let elementType = node.array.elementType;

        if (elements.length > 0) {
            const firstType = getExpressionType(elements[0], scope);

            if (!elementType) {
                elementType = firstType;
            }

            for (const element of elements) {
                const actualType = getExpressionType(element, scope);

                if (elementType !== "dynamic" && actualType !== elementType) {
                    if (!node.array.elementType) {
                        elementType = "dynamic";
                        break;
                    }

                    throw new Error(
                        `배열 요소의 타입이 일치하지 않습니다: ${node.name} (${elementType} ← ${actualType})`
                    );
                }
            }
        }

        elementType ??= "dynamic";

        node.array.elementType = elementType;
        scope.declared.set(node.name, `${elementType}[]`);

        if (node.mutable) {
            scope.mutable.add(node.name);
        }

        scope.initialized.add(node.name);

        return;
    }

    const isInput = node.value.type === "InputExpression";
    const actualType = getExpressionType(node.value, scope);

    if (!isInput && node.varType && node.varType !== actualType) {
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
