import type { WhileStatementNode } from "../ast/node";

import type { Scope } from "./main";

import { validateNode } from "./node";
import { getExpressionType } from "./util/expression";

export function validateWhile(node: WhileStatementNode, scope: Scope): void {
    const type = getExpressionType(node.test, scope);

    if (type !== "bool") {
        throw new Error(
            `while 조건식은 bool 타입이어야 합니다. 현재 타입: ${type}`,
        );
    }

    const bodyScope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        initialized: new Set(),
        parent: scope,
        loopDepth: scope.loopDepth + 1,
    };

    for (const statement of node.body) {
        validateNode(statement, bodyScope);
    }
}
