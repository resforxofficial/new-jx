import type { ASTNode } from "../ast/node";
import type { TransformScope } from "./especial/context";

import { transformVariable } from "./variable";
import { transformOutput } from "./output";
import { transformAssignment } from "./assignment";
import { transformIf } from "./trif";
import { transformWhile } from "./while";
import { transformFor } from './trfor';
import { transformBreak } from "./break";
import { transformContinue } from "./continue";
import { transformForOf } from "./tranforof";
import { transformFunction } from "./tranfunc/function";
import { transformReturn } from "./tranfunc/tranreturn";
import { transformExpressionStatement } from "./newepxr";

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
        case "BreakStatement":
            return transformBreak(node, scope);
        case "ContinueStatement":
            return transformContinue(node, scope);
        
        case "ForOfStatement":
            return transformForOf(node, scope);

        case "FunctionDeclaration":
            return transformFunction(node, scope);
        
        case "ReturnStatement":
            return transformReturn(node, scope);

        case "ExpressionStatement":
            return transformExpressionStatement(node, scope);

        default:
            const _exhaustiveCheck: never = node;
            throw new Error(`Unhandled node type: ${(node as any).type}`);
    }
}
