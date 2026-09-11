import type { BreakStatementNode } from "../ast/node";

import type { Scope } from "./main";

export function validateBreak(node: BreakStatementNode, scope: Scope): void {
    if (scope.loopDepth === 0) {
        throw new Error(`break는 반복문 안에서만 사용할 수 있습니다.`);
    }
}
