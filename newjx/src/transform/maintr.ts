import type { ASTNode } from "../ast/node";
import { transformVariable } from "./variable";

export function transform(ast: ASTNode[]): string {
    return ast.map(transformNode).join("\n");
}

function transformNode(node: ASTNode): string {
    switch (node.type) {
        case "VariableDeclaration":
            return transformVariable(node);

        default:
            throw new Error(`지원하지 않는 AST 노드입니다: ${node.type}`);
    }
}
