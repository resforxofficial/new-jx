import type { FunctionDeclarationNode } from "../../ast/node";
import type { TransformScope } from "../especial/context";
import { transformNode } from "../node";

const typeMap: Record<string, string> = {
    int: "number",
    str: "string",
    bool: "boolean",
    void: "void",
};

export function transformFunction(node: FunctionDeclarationNode, scope: TransformScope): string {
    const returnType = typeMap[node.returnType] ?? node.returnType;

    const parameters = node.parameters
        .map(parameter => `${parameter.name}: ${typeMap[parameter.type] ?? parameter.type}`)
        .join(", ");

    const body = node.body
        .map(statement => transformNode(statement, scope))
        .join("\n");

    return `function ${node.name}(${parameters}): ${returnType} {\n${body}\n}`;
}
