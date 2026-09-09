import type { IfStatementNode } from "../ast/node";

import type { Scope } from "./main";

import { getExpressionType } from "./util/expression";

export function validateIf(node: IfStatementNode, scope: Scope): void {
    const type = getExpressionType(node.test, scope);

    if (type !== "bool") {
        throw new Error(`if 조건식은 bool 타입이어야 합니다. 현재 타입: ${type}`);
    }
}
