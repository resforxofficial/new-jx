import type { ASTNode } from "../ast/node";

import { transformVariable } from "./variable";
import { transformOutput } from "./output";
import { transformAssignment } from "./assignment";
import { transformIf } from "./trif";
import { transformWhile } from "./while";
import { transformFor } from './trfor';

export function transformNode(node: ASTNode): string {
    switch (node.type) {
        case "VariableDeclaration":
            return transformVariable(node);

        case "OutputStatement":
            return transformOutput(node);

        case "Assignment":
            return transformAssignment(node);

        case "IfStatement":
            return transformIf(node);

        case "WhileStatement":
            return transformWhile(node);

        case "ForStatement":
            return transformFor(node);

        default:
            const _exhaustiveCheck: never = node;
            throw new Error(`Unhandled node type: ${(node as any).type}`);
    }
}
