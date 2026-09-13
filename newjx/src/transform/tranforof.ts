import type { ForOfStatementNode } from "../ast/node";
import type { TransformScope } from "./especial/context";
import { transformExpression } from "./expressions";
import { transformNode } from "./node";

export function transformForOf(node: ForOfStatementNode, scope: TransformScope): string {
    const iterable = transformExpression(node.iterable);
    const body = node.body.map(statement => transformNode(statement, scope)).join("\n");

    return `for (const ${node.iteratorName} of ${iterable}) {\n${body}\n}`;
}
