import type { AssignmentNode } from "../ast/node";

import type { Scope } from "./main";

import { getExpressionType } from "./util/expression";

export function validateAssignment(node: AssignmentNode, scope: Scope): void {
    const name = node.target.name;

    let currentScope: Scope | undefined = scope;
    let declaredType: string | undefined;

    while (currentScope) {
        declaredType = currentScope.declared.get(name);

        if (declaredType) {
            break;
        }

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

    if (!isInput && declaredType !== "dynamic" && declaredType !== actualType) {
        throw new Error(
            `대입하는 값의 타입이 일치하지 않습니다: ${name} (${declaredType} ← ${actualType})`
        );
    }

    scope.initialized.add(name);
}
