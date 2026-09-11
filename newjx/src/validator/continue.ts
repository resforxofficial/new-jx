import { ContinueStatementNode } from '../ast/node';
import type { Scope } from './main';

export function validateContinue(node: ContinueStatementNode, scope: Scope): void {
    if (scope.loopDepth === 0) {
        throw new Error(`continue는 반복문 안에서만 사용할 수 있습니다.`);
    }
}
