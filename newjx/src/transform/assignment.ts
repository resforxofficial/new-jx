import type { AssignmentNode } from "../ast/node";
import type { TransformScope } from "./especial/context";
import { getTransformType } from "./especial/context";
import { transformExpression } from "./expressions";

export function transformAssignment(node: AssignmentNode, scope: TransformScope): string {
    let target = "";
    let value = "";

    if (node.target.type === "Identifier") {
        target = node.target.name;
    } else if (node.target.type === "IndexExpression") {
        target = transformExpression(node.target);
    }

    if (node.value.type === "InputExpression") {
        const prompt = `input("${node.value.promptText}")`;

        if (node.target.type !== "Identifier") {
            value = `parseInput(${prompt})`;
        } else {
            const targetType = getTransformType(scope, node.target.name);

            if (targetType === "int") {
                value = `Number(${prompt})`;
            } else if (targetType === "bool") {
                value = `${prompt} === "true"`;
            } else if (targetType === "str") {
                value = prompt;
            } else {
                value = `parseInput(${prompt})`;
            }
        }
    } else {
        value = transformExpression(node.value);
    }

    return `${target} = ${value};`;
}
