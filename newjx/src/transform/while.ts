import type { WhileStatementNode } from "../ast/node";
import { transformExpression } from "./expressions";
import { transformNode } from "./node";

export function transformWhile(node: WhileStatementNode): string {
    const test = transformExpression(node.test);

    const body = node.body.map(transformNode).join("\n");

    return `while (${test}) {\n${body}\n}`;
}
