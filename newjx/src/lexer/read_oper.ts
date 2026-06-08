import { Token } from "./tokens";
import { DOUBLE_OPERATORS, SINGLE_OPERATORS } from './keyword';

export function readOperator(source: string, tokens: Token[], current: number): number {
    const start = current;
    const two = source.slice(current, current + 2);

    if (DOUBLE_OPERATORS.has(two)) {
        tokens.push({ type: "Operator", value: two, position: start });
        return current + 2;
    }

    const one = source[current];
    if (SINGLE_OPERATORS.has(one)) {
        tokens.push({ type: "Operator", value: one, position: start });
        return current + 1;
    }

    throw new Error(`알 수 없는 연산자: ${one}`);
}