import { ContinueStatementNode } from '../ast/node';
import { TransformScope } from './especial/context';

export function transformContinue(node: ContinueStatementNode, scope: TransformScope): string {
    return "continue;";
}
