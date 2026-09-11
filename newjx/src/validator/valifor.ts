import type { ForStatementNode } from "../ast/node";
import type { Scope } from "./main";

import { validateNode } from "./node";
import { getExpressionType } from "./util/expression";

export function validateFor(node: ForStatementNode, scope: Scope): void {
    const forScope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        initialized: new Set(),
        parent: scope,
        loopDepth: scope.loopDepth + 1,
    };

    validateNode(node.init, forScope);
    const testType = getExpressionType(node.test, forScope);

    if (testType !== "bool") {
        throw new Error(`for 조건식은 bool 타입이어야 합니다. 현재 타입: ${testType}`);
    }

    for (const statement of node.body) {
        validateNode(statement, forScope);
    }
}
