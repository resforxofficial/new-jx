import type { ForStatementNode } from "../ast/node";
import type { TransformScope } from "./especial/context";
import { transformExpression } from "./expressions";
import { transformNode } from "./node";

export function transformFor(node: ForStatementNode, scope: TransformScope): string {
    const initValue = node.init.value ? transformExpression(node.init.value) : "";

    const init = `let ${node.init.name} = ${initValue}`;
    const test = transformExpression(node.test);

    const update =
        node.updateOperator === "+"
            ? `${node.iteratorName}++`
            : `${node.iteratorName}--`;

    const body = node.body.map(node => transformNode(node, scope)).join("\n");

    return `for (${init}; ${test}; ${update}) {\n${body}\n}`;
}
