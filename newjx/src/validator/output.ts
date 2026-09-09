import type { OutputStatementNode } from "../ast/node";
import type { Scope } from "./main";
import { getExpressionType } from "./util/expression";

export function validateOutput(node: OutputStatementNode, scope: Scope): void {
    for (const expression of node.expressions) {
        getExpressionType(expression, scope);
    }
}
