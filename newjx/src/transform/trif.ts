import type { IfStatementNode } from "../ast/node";
import type { TransformScope } from "./especial/context";
import { transformExpression } from "./expressions";
import { transformNode } from "./node";

export function transformIf(node: IfStatementNode, scope: TransformScope): string {
    const test = transformExpression(node.test);
    const consequent = node.consequent.map(node => transformNode(node, scope)).join("\n");

    let result = `if (${test}) {\n${consequent}\n}`;

    if (node.alternate) {
        const alternate = node.alternate.map(node => transformNode(node, scope)).join("\n");

        result += ` else {\n${alternate}\n}`;
    }

    return result;
}
