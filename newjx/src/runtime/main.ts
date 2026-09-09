import type { ASTNode } from "../ast/node";

export function hasInput(ast: ASTNode[]): boolean {
    for (const node of ast) {
        if (node.type === "VariableDeclaration" && node.value?.type === "InputExpression") {
            return true;
        }

        if (node.type === "Assignment" && node.value.type === "InputExpression") {
            return true;
        }

        if (node.type === "IfStatement") {
            if (hasInput(node.consequent)) {
                return true;
            }

            if (node.alternate && hasInput(node.alternate)) {
                return true;
            }
        }

        if (node.type === "WhileStatement") {
            if (hasInput(node.body)) {
                return true;
            }
        }

        if (node.type === "ForStatement") {
            if (hasInput(node.body)) {
                return true;
            }
        }
    }

    return false;
}