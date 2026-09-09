import type { IfStatementNode } from "../ast/node";

import type { Scope } from "./main";
import { validateNode } from "./node";

import { getExpressionType } from "./util/expression";

export function validateIf(node: IfStatementNode, scope: Scope): void {
    const type = getExpressionType(node.test, scope);

    if (type !== "bool") {
        throw new Error(`if 조건식은 bool 타입이어야 합니다. 현재 타입: ${type}`);
    }

    const consequentScope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        initialized: new Set(),
        parent: scope,
    };

    for (const statement of node.consequent) {
        validateNode(statement, consequentScope);
    }

    if (node.alternate) {
        const alternateScope: Scope = {
            declared: new Map(),
            mutable: new Set(),
            initialized: new Set(),
        }

        for (const statement of node.alternate) {
            validateNode(statement, alternateScope);
        }
    }
}
