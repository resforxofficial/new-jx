import type { OutputStatementNode } from "../ast/node";
import type { TransformScope } from "./especial/context";
import { transformExpression } from "./expressions";

export function transformOutput(node: OutputStatementNode, scope: TransformScope): string {
    const expressions = node.expressions.map(transformExpression).join(", ");

    return `console.log(${expressions});`;
}
