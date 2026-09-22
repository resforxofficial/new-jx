import type { FunctionDeclarationNode } from "../../ast/node";
import type { Scope } from "../main";
import { validateNode } from "../node";

export function validateFunction(node: FunctionDeclarationNode, scope: Scope): void {
    const functionScope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        initialized: new Set(),
        arrays: new Map(),
        functions: scope.functions,
        parent: scope,
        functionReturnType: node.returnType,
        functionReturnArray: node.returnArray,
        loopDepth: 0,
    };

    for (const parameter of node.parameters) {
        if (functionScope.declared.has(parameter.name)) {
            throw new Error(`중복된 매개변수입니다: ${parameter.name}`);
        }

        const parameterType = parameter.array
            ? `${parameter.type}[]`
            : parameter.type;

        functionScope.declared.set(parameter.name, parameterType);
        functionScope.mutable.add(parameter.name);
        functionScope.initialized.add(parameter.name);

        if (parameter.array) {
            functionScope.arrays.set(parameter.name, parameter.array);
        }
    }

    for (const statement of node.body) {
        validateNode(statement, functionScope);
    }

    if (node.returnType !== "void" && !hasGuaranteedReturn(node.body)) {
        throw new Error(
            `반환값이 필요한 함수입니다: ${node.name} (${node.returnType})`
        );
    }
}

function hasGuaranteedReturn(body: FunctionDeclarationNode["body"]): boolean {
    for (const statement of body) {
        if (statement.type === "ReturnStatement") {
            return true;
        }

        if (statement.type === "IfStatement") {
            if (
                statement.alternate &&
                hasGuaranteedReturn(statement.consequent) &&
                hasGuaranteedReturn(statement.alternate)
            ) {
                return true;
            }
        }
    }

    return false;
}
