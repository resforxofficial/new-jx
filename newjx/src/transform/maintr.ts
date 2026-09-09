import type { ASTNode } from "../ast/node";
import { createTransformScope } from "./especial/context";
import { transformNode } from "./node";

export function transform(ast: ASTNode[]): string {
    const scope = createTransformScope();

    return ast.map(node => transformNode(node, scope)).join("\n");
}
