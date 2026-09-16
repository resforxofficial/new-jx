import type { ForOfStatementNode } from "../ast/node";

import type { Scope } from "./main";

import { getExpressionType } from "./util/expression";
import { validateNode } from "./node";

export function validateForOf(node: ForOfStatementNode, scope: Scope): void {
    const iterableType = getExpressionType(node.iterable, scope);

    if (!iterableType.endsWith("[]")) {
        throw new Error(`for-of 대상은 배열이어야 합니다: ${iterableType}`);
    }

    const elementType = iterableType.slice(0, -2);

    if (
        node.varType &&
        elementType !== "dynamic" &&
        node.varType !== "dynamic" &&
        node.varType !== elementType
    ) {
        throw new Error(
            `for-of 변수의 타입이 배열 요소의 타입과 일치하지 않습니다: ${node.varType} ← ${elementType}`
        );
    }

    const iteratorType = node.varType ?? elementType;

    const forOfScope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        initialized: new Set(),
        parent: scope,
        arrayLength: new Map(),
        functions: new Map(),
        loopDepth: scope.loopDepth + 1,
    };

    forOfScope.declared.set(node.iteratorName, iteratorType);
    forOfScope.mutable.add(node.iteratorName);
    forOfScope.initialized.add(node.iteratorName);

    for (const statement of node.body) {
        validateNode(statement, forOfScope);
    }
}
