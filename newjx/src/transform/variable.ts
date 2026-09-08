import type { VariableDeclarationNode } from "../ast/node";
import { transformExpression } from "./expressions";

const typeMap: Record<string, string> = {
    int: "number",
    str: "string",
    bool: "boolean",
};

export function transformVariable(node: VariableDeclarationNode): string {
    const keyword = node.mutable ? "let" : "const";
    const value = node.value ? transformExpression(node.value) : "";

    if (node.varType) {
        const type = typeMap[node.varType];

        if (!type) {
            throw new Error(`알 수 없는 타입입니다: ${node.varType}`);
        }

        return `${keyword} ${node.name}: ${type} = ${value};`;
    }

    return `${keyword} ${node.name} = ${value};`;
}
