import type { ExpressionStatementNode } from "../ast/node";
import type { Scope } from "./main";
import { getExpressionType } from "./util/expression";

export function validateExpressionStatement(node: ExpressionStatementNode, scope: Scope): void {
    getExpressionType(node.expression, scope);
}
