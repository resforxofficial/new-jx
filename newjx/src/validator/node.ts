import type { ASTNode } from "../ast/node";
import type { Scope } from "./main";
import { validateAssignment } from "./assignment";
import { validateBreak } from "./break";
import { validateContinue } from "./continue";
import { validateOutput } from "./output";
import { validateIf } from "./valif";
import { validateFor } from "./valifor";
import { validateVariable } from "./variable";
import { validateWhile } from "./while";

export function validateNode(node: ASTNode, scope: Scope): void {
    switch (node.type) {
        case "VariableDeclaration":
            // 다음 단계에서 연결
            validateVariable(node, scope);
            return;

        case "Assignment":
            // 다음 단계에서 연결
            validateAssignment(node, scope);
            return;

        case "OutputStatement":
            validateOutput(node, scope);
            // 다음 단계에서 연결
            return;

        case "IfStatement":
            validateIf(node, scope);
            // 다음 단계에서 연결
            return;

        case "WhileStatement":
            // 다음 단계에서 연결
            validateWhile(node, scope);
            return;

        case "ForStatement":
            // 다음 단계에서 연결
            validateFor(node, scope);
            return;

        case "BreakStatement":
            return validateBreak(node, scope);

        case "ContinueStatement":
            return validateContinue(node, scope);

        default:
            const _exhaustiveCheck: never = node;
            throw new Error(`Unhandled node type: ${(node as any).type}`);
    }
}
