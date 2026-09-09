import type { AssignmentNode } from "../ast/node";

import type { TransformScope } from "./especial/context";

import { getTransformType } from "./especial/context";
import { transformExpression } from "./expressions";

export function transformAssignment(node: AssignmentNode, scope: TransformScope): string {
    const target = node.target.name;
    let value = "";

    if (node.value.type === "InputExpression") {
        const prompt = `input("${node.value.promptText}")`;
        const targetType = getTransformType(scope, target);

        if (targetType === "int") {
            value = `Number(${prompt})`;
        } else if (targetType === "bool") {
            value = `${prompt} === "true"`;
        } else if (targetType === "str") {
            value = prompt;
        } else {
            value = `parseInput(${prompt})`;
        }
    } else {
        value = transformExpression(node.value);
    }

    return `${target} = ${value};`;
}
