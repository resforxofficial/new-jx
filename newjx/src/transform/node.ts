import type { ASTNode } from "../ast/node";

import { transformVariable } from "./variable";
import { transformOutput } from "./output";
import { transformAssignment } from "./assignment";
import { transformIf } from "./trif";
import { transformWhile } from "./while";
import { transformFor } from './trfor';
import type { TransformScope } from "./especial/context";

export function transformNode(node: ASTNode, scope: TransformScope): string {
    switch (node.type) {
        case "VariableDeclaration":
            return transformVariable(node, scope);

        case "OutputStatement":
            return transformOutput(node, scope);

        case "Assignment":
            return transformAssignment(node, scope);

        case "IfStatement":
            return transformIf(node, scope);

        case "WhileStatement":
            return transformWhile(node, scope);

        case "ForStatement":
            return transformFor(node, scope);

        default:
            const _exhaustiveCheck: never = node;
            throw new Error(`Unhandled node type: ${(node as any).type}`);
    }
}
