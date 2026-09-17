import type { ASTNode, FunctionDeclarationNode } from "../../ast/node";
import type { Scope } from "../main";
import { validateNode } from "../node";

export function validateFunction(node: FunctionDeclarationNode, scope: Scope): void {
    const functionScope: Scope = {
        declared: new Map(),
        mutable: new Set(),
        initialized: new Set(),
        arrayLength: new Map(),
        functions: scope.functions,
        parent: scope,
        functionReturnType: node.returnType,
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

    if (node.returnType !== "void" && !blockReturns(node.body)) {
        throw new Error(
            `반환값이 필요한 함수입니다: ${node.name} (${node.returnType})`
        );
    }
}

function blockReturns(body: ASTNode[]): boolean {
    for (const statement of body) {
        if (statement.type === "ReturnStatement") {
            return true;
        }

        if (statement.type === "IfStatement") {
            const consequentReturns = blockReturns(statement.consequent);
            const alternateReturns = statement.alternate
                ? blockReturns(statement.alternate)
                : false;

            if (consequentReturns && alternateReturns) {
                return true;
            }
        }

        if (statement.type === "WhileStatement") {
            if (statement.test.type === "Literal" && statement.test.value === true && blockReturns(statement.body)) {
                return true;
            }
        }
    }

    return false;
}
