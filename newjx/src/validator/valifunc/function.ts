import type { FunctionDeclarationNode } from "../../ast/node";
import type { Scope } from "../main";
import { validateNode } from "../node";

export function validateFunction(node: FunctionDeclarationNode, scope: Scope): void {
    const functionScope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        initialized: new Set(),
        arrayLength: new Map(),
        parent: scope,
        loopDepth: 0,
    };

    for (const parameter of node.parameters) {
        if (functionScope.declared.has(parameter.name)) {
            throw new Error(`중복된 매개변수입니다: ${parameter.name}`);
        }

        functionScope.declared.set(parameter.name, parameter.type);
        functionScope.mutable.add(parameter.name);
        functionScope.initialized.add(parameter.name);
    }

    for (const statement of node.body) {
        validateNode(statement, functionScope);
    }
}
