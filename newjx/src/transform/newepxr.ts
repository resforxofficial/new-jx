import type { ExpressionStatementNode } from "../ast/node";
import type { TransformScope } from "./especial/context";
import { transformExpression } from "./expressions";

export function transformExpressionStatement(node: ExpressionStatementNode, scope: TransformScope): string {
    return `${transformExpression(node.expression)};`;
}
