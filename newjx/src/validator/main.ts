import type { ASTNode } from "../ast/node";
import { validateNode } from "./node";

export interface Scope {
    declared: Map<string, string>;
    mutable: Set<string>;
    initialized: Set<string>;
    arrayLength: Map<string, number | undefined>;
    parent?: Scope;
    functionReturnType?: string;
    loopDepth: number;
}

export function validate(ast: ASTNode[]): void {
    const scope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        arrayLength: new Map(),
        initialized: new Set(),
        loopDepth: 0,
    };

    for (const node of ast) {
        validateNode(node, scope);
    }
}
