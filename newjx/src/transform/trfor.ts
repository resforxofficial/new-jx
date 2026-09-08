import type { ForStatementNode } from "../ast/node";
import { transformExpression } from "./expressions";
import { transformNode } from "./node";

export function transformFor(node: ForStatementNode): string {
    const initValue = node.init.value ? transformExpression(node.init.value) : "";

    const init = `let ${node.init.name} = ${initValue}`;
    const test = transformExpression(node.test);

    const update =
        node.updateOperator === "+"
            ? `${node.iteratorName}++`
            : `${node.iteratorName}--`;

    const body = node.body.map(transformNode).join("\n");

    return `for (${init}; ${test}; ${update}) {\n${body}\n}`;
}
