import type { BreakStatementNode } from "../ast/node";
import type { TransformScope } from "./especial/context";

export function transformBreak(node: BreakStatementNode, scope: TransformScope): string {
    return "break;";
}