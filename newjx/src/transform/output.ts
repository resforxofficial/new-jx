import type { OutputStatementNode } from "../ast/node";
import { transformExpression } from "./expressions";

export function transformOutput(node: OutputStatementNode): string {
    const expressions = node.expressions
        .map(transformExpression)
        .join(", ");

    return `console.log(${expressions});`;
}