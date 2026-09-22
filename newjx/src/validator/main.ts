import type { ASTNode, ArrayTypeNode } from "../ast/node";
import { validateNode } from "./node";

export interface FunctionInfo {
    returnType: string;
    returnArray?: ArrayTypeNode;
    parameters: {
        type: string;
        name: string;
        array?: ArrayTypeNode;
    }[];
}

export interface Scope {
    declared: Map<string, string>;
    mutable: Set<string>;
    initialized: Set<string>;
    arrays: Map<string, ArrayTypeNode>;
    parent?: Scope;
    functionReturnType?: string;
    functionReturnArray?: ArrayTypeNode;
    functions: Map<string, FunctionInfo>;
    loopDepth: number;
}

export function validate(ast: ASTNode[]): void {
    const scope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        initialized: new Set(),
        arrays: new Map(),
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
                returnArray: node.returnArray,
                parameters: node.parameters.map(param => ({
                    type: param.type,
                    name: param.name,
                    array: param.array,
                })),
            });
        }
    }

    for (const node of ast) {
        validateNode(node, scope);
    }
}
