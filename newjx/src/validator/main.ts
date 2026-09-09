import type { ASTNode } from "../ast/node";
import { validateNode } from "./node";

export interface Scope {
    declared: Map<string, string>;
    mutable: Set<string>;
    initialized: Set<string>;
    parent?: Scope;
}

export function validate(ast: ASTNode[]): void {
    const scope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        initialized: new Set(),
    };

    for (const node of ast) {
        validateNode(node, scope);
    }
}
