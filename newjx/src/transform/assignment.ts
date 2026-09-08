import type { AssignmentNode } from "../ast/node";
import { transformExpression } from "./expressions";

export function transformAssignment(node: AssignmentNode): string {
    const target = node.target.name;
    const value = transformExpression(node.value);

    return `${target} = ${value};`;
}
