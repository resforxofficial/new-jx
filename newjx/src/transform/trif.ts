import type { IfStatementNode } from "../ast/node";
import { transformExpression } from "./expressions";
import { transformNode } from "./node";

export function transformIf(node: IfStatementNode): string {
    const test = transformExpression(node.test);
    const consequent = node.consequent.map(transformNode).join("\n");

    let result = `if (${test}) {\n${consequent}\n}`;

    if (node.alternate) {
        const alternate = node.alternate.map(transformNode).join("\n");

        result += ` else {\n${alternate}\n}`;
    }

    return result;
}
