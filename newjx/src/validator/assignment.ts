import type { AssignmentNode } from "../ast/node";
import type { Scope } from "./main";
import { getExpressionType } from "./util/expression";

export function validateAssignment(node: AssignmentNode, scope: Scope): void {
    const name = node.target.name;
    const declaredType = scope.declared.get(name);

    if (!declaredType) {
        throw new Error(`선언되지 않은 변수입니다: ${name}`);
    }

    if (!scope.mutable.has(name)) {
        throw new Error(`immut 변수에는 값을 대입할 수 없습니다: ${name}`);
    }

    const actualType = getExpressionType(node.value, scope);

    if (declaredType !== actualType) {
        throw new Error(
            `대입하는 값의 타입이 일치하지 않습니다: ${name} (${declaredType} ← ${actualType})`,
        );
    }

    scope.initialized.add(name);
}
