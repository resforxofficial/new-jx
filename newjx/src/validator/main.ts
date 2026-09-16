import type { ASTNode } from "../ast/node";
import { validateNode } from "./node";

export interface FunctionInfo {
    returnType: string;
    parameters: {
        type: string;
        name: string;
    }[];
}

export interface Scope {
    declared: Map<string, string>;
    mutable: Set<string>;
    initialized: Set<string>;
    arrayLength: Map<string, number | undefined>;
    parent?: Scope;
    functionReturnType?: string;
    functions: Map<string, FunctionInfo>;
    loopDepth: number;
}

export function validate(ast: ASTNode[]): void {
    const scope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        arrayLength: new Map(),
        initialized: new Set(),
        functions: new Map(),
        loopDepth: 0,
    };

    for (const node of ast) {
        validateNode(node, scope);
    }
}
