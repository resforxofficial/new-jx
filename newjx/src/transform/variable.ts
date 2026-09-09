import type { VariableDeclarationNode } from "../ast/node";
import type { TransformScope } from "./especial/context";
import { transformExpression } from "./expressions";

const typeMap: Record<string, string> = {
    int: "number",
    str: "string",
    bool: "boolean",
};

export function transformVariable(node: VariableDeclarationNode, scope: TransformScope): string {
    const keyword = node.mutable ? "let" : "const";
    let value = node.value ? transformExpression(node.value) : "";

    if (node.value?.type === "InputExpression") {
        const prompt = `input("${node.value.promptText}")`;

        if (node.varType === "int") {
            value = `Number(${prompt})`;
        } else if (node.varType === "bool") {
            value = `${prompt} === "true"`;
        } else if (node.varType === "str") {
            value = prompt;
        } else {
            value = `parseInput(${prompt})`;
        }
    }

    let inferredType = "dynamic";

    if (node.varType) {
        inferredType = node.varType;
    } else if (node.value?.type === "Literal") {
        if (typeof node.value.value === "number") {
            inferredType = "int";
        } else if (typeof node.value.value === "string") {
            inferredType = "str";
        } else if (typeof node.value.value === "boolean") {
            inferredType = "bool";
        }
    }
    scope.declared.set(node.name, inferredType);

    if (node.varType) {
        const type = typeMap[node.varType];

        if (!type) {
            throw new Error(`알 수 없는 타입입니다: ${node.varType}`);
        }

        return `${keyword} ${node.name}: ${type} = ${value};`;
    }

    if (inferredType === "dynamic") {
        return `${keyword} ${node.name}: any = ${value};`;
    }

    return `${keyword} ${node.name} = ${value};`;
}
