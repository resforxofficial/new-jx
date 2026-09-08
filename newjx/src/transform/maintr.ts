import type { ASTNode } from "../ast/node";
import { transformNode } from "./node";

export function transform(ast: ASTNode[]): string {
    return ast.map(transformNode).join("\n");
}
