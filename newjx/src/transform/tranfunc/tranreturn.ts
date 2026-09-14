import type { ReturnStatementNode } from "../../ast/node";
import type { TransformScope } from "../especial/context";
import { transformExpression } from "../expressions";

export function transformReturn(node: ReturnStatementNode, scope: TransformScope): string {
    if (!node.value) {
        return "return;";
    }

    return `return ${transformExpression(node.value)};`;
}
