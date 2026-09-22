import type { AssignmentNode, ArrayTypeNode } from "../ast/node";
import type { Scope } from "./main";
import { getExpressionType, getArrayInfo } from "./util/expression";

function findArrayInfo(name: string, scope: Scope): ArrayTypeNode | undefined {
    let currentScope: Scope | undefined = scope;
    while (currentScope) {
        const arrayInfo = currentScope.arrays.get(name);
        if (arrayInfo) return arrayInfo;

        currentScope = currentScope.parent;
    }

    return undefined;
}

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
        const targetArray = findArrayInfo(name, scope);

        if (targetArray && node.operator === "=" && !isInput) {
            const sourceArray = getArrayInfo(node.value, scope);
            if (!sourceArray) {
                throw new Error(`배열 변수에는 배열 타입의 값만 대입할 수 있습니다: ${name} ← ${actualType}`,);
            }

            const targetElementType = targetArray.elementType ?? "dynamic";
            const sourceElementType = sourceArray.elementType ?? "dynamic";
            if (targetElementType !== "dynamic" && sourceElementType !== "dynamic" &&
                targetElementType !== sourceElementType
            ) {
                throw new Error(`배열 요소 타입이 일치하지 않습니다: ${name} (${targetElementType}[] ← ${sourceElementType}[])`,);
            }

            if (targetArray.length !== undefined && sourceArray.initializedLength !== undefined &&
                sourceArray.initializedLength > targetArray.length
            ) {
                throw new Error(`배열의 초기화된 요소 수가 capacity를 초과합니다: ${name}
                    (초기화 ${sourceArray.initializedLength}, capacity ${targetArray.length})`,);
            }

            targetArray.initializedLength = sourceArray.initializedLength;
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
        else if (!isInput && node.operator === "=" && declaredType !== "dynamic" && declaredType !== actualType) {
            throw new Error(`대입하는 값의 타입이 일치하지 않습니다: ${name} (${declaredType} ← ${actualType})`,);
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

        if (indexType !== "int" && indexType !== "dynamic") {
            throw new Error(`배열 인덱스는 int 타입이어야 합니다: ${indexType}`);
        }

        if (
            array.type === "Identifier" &&
            index.type === "Literal" &&
            typeof index.value === "number"
        ) {
            let currentScope: Scope | undefined = scope;
            let arrayInfo2: ArrayTypeNode | undefined;

            while (currentScope) {
                arrayInfo2 = currentScope.arrays.get(array.name);
                if (arrayInfo2) break;

                currentScope = currentScope.parent;
            }

            if (arrayInfo2?.length !== undefined && index.value >= arrayInfo2.length) {
                throw new Error(`배열 인덱스가 범위를 벗어났습니다: ${array.name}[${index.value}] (capacity ${arrayInfo2.length})`,);
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
