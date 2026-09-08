import type { ASTNode } from "../ast/node";

import { transformVariable } from "./variable";
import { transformOutput } from "./output";
import { transformAssignment } from "./assignment";
import { transformIf } from './trif';

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

        default:
            throw new Error(`지원하지 않는 AST 노드입니다: ${node.type}`);
    }
}
