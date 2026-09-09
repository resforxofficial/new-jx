import type { WhileStatementNode } from "../ast/node";
import type { TransformScope } from "./especial/context";
import { transformExpression } from "./expressions";
import { transformNode } from "./node";

export function transformWhile(node: WhileStatementNode, scope: TransformScope): string {
    const test = transformExpression(node.test);

    const body = node.body.map(node => transformNode(node, scope)).join("\n");

    return `while (${test}) {\n${body}\n}`;
}
