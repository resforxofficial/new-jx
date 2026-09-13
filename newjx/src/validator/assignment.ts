import type { AssignmentNode } from "../ast/node";
import type { Scope } from "./main";
import { getExpressionType } from "./util/expression";

export function validateAssignment(node: AssignmentNode, scope: Scope): void {
    if (node.target.type === "Identifier") {
        const name = node.target.name;

        let currentScope: Scope | undefined = scope;
        let declaredType: string | undefined;

        while (currentScope) {
            declaredType = currentScope.declared.get(name);
            if (declaredType) break;
            currentScope = currentScope.parent;
        }

        if (!declaredType) {
            throw new Error(`선언되지 않은 변수입니다: ${name}`);
        }

        currentScope = scope;
        let mutable = false;

        while (currentScope) {
            if (currentScope.mutable.has(name)) {
                mutable = true;
                break;
            }
            currentScope = currentScope.parent;
        }

        if (!mutable) {
            throw new Error(`immut 변수에는 값을 대입할 수 없습니다: ${name}`);
        }

        const isInput = node.value.type === "InputExpression";
        const actualType = getExpressionType(node.value, scope);

        if (
            !isInput &&
            node.operator === "=" &&
            declaredType !== "dynamic" &&
            declaredType !== actualType
        ) {
            throw new Error(
                `대입하는 값의 타입이 일치하지 않습니다: ${name} (${declaredType} ← ${actualType})`,
            );
        }

        if (node.operator !== "=" && !isInput) {
            if (node.operator === "+=") {
                if (declaredType !== "int" && declaredType !== "str") {
                    throw new Error(
                        `+= 연산을 사용할 수 없는 타입입니다: ${declaredType}`,
                    );
                }

                if (actualType !== "dynamic" && actualType !== declaredType) {
                    throw new Error(
                        `+= 연산의 타입이 일치하지 않습니다: ${declaredType} += ${actualType}`,
                    );
                }
            } else {
                if (declaredType !== "int") {
                    throw new Error(
                        `${node.operator} 연산을 사용할 수 없는 타입입니다: ${declaredType}`,
                    );
                }

                if (actualType !== "dynamic" && actualType !== "int") {
                    throw new Error(
                        `${node.operator} 연산의 타입이 일치하지 않습니다: ${declaredType} ${node.operator} ${actualType}`,
                    );
                }
            }
        }

        scope.initialized.add(name);
        return;
    }

    if (node.target.type === "IndexExpression") {
        const array = node.target.target;
        const index = node.target.index;

        const arrayType = getExpressionType(array, scope);
        const indexType = getExpressionType(index, scope);
        const valueType = getExpressionType(node.value, scope);

        if (!arrayType.endsWith("[]")) {
            throw new Error(`배열이 아닌 값은 인덱싱할 수 없습니다: ${arrayType}`);
        }

        if (indexType !== "int") {
            throw new Error(`배열 인덱스는 int 타입이어야 합니다: ${indexType}`);
        }

        if (
            array.type === "Identifier" &&
            index.type === "Literal" &&
            typeof index.value === "number"
        ) {
            let currentScope: Scope | undefined = scope;
            let length: number | undefined;

            while (currentScope) {
                if (currentScope.arrayLength.has(array.name)) {
                    length = currentScope.arrayLength.get(array.name);
                    break;
                }
                currentScope = currentScope.parent;
            }

            if (length !== undefined && index.value >= length) {
                throw new Error(
                    `배열 인덱스가 범위를 벗어났습니다: ${array.name}[${index.value}] (길이 ${length})`,
                );
            }

            if (index.value < 0) {
                throw new Error(`배열 인덱스는 0 이상이어야 합니다: ${index.value}`);
            }
        }

        const elementType = arrayType.slice(0, -2);

        if (node.operator === "=") {
            if (
                valueType !== "dynamic" &&
                elementType !== "dynamic" &&
                valueType !== elementType
            ) {
                throw new Error(
                    `배열 요소의 타입이 일치하지 않습니다: ${elementType} ← ${valueType}`,
                );
            }
        } else if (node.operator === "+=") {
            if (elementType !== "int" && elementType !== "str") {
                throw new Error(
                    `+= 연산을 사용할 수 없는 배열 요소 타입입니다: ${elementType}`,
                );
            }

            if (valueType !== "dynamic" && valueType !== elementType) {
                throw new Error(
                    `+= 연산의 타입이 일치하지 않습니다: ${elementType} += ${valueType}`,
                );
            }
        } else {
            if (elementType !== "int") {
                throw new Error(
                    `${node.operator} 연산을 사용할 수 없는 배열 요소 타입입니다: ${elementType}`,
                );
            }

            if (valueType !== "dynamic" && valueType !== "int") {
                throw new Error(
                    `${node.operator} 연산의 타입이 일치하지 않습니다: ${elementType} ${node.operator} ${valueType}`,
                );
            }
        }

        return;
    }
}
