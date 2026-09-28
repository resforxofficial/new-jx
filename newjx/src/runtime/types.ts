export function expectInt(value: unknown): number {
    if (typeof value !== "number" || !Number.isInteger(value)) {
        throw new Error(`int 타입이 필요합니다: ${String(value)}`);
    }

    return value;
}
