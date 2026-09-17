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
        if (node.type === "FunctionDeclaration") {
            if (scope.functions.has(node.name)) {
                throw new Error(`이미 선언된 함수입니다: ${node.name}`);
            }

            scope.functions.set(node.name, {
                returnType: node.returnType,
                parameters: node.parameters,
            });
        }
    }

    for (const node of ast) {
        validateNode(node, scope);
    }
}
