import promptSync from "prompt-sync";

const prompt = promptSync();

export function input(promptText: string): string {
    return prompt(promptText);
}

export function parseInput(value: string): number | boolean | string {
    if (/^-?\d+$/.test(value)) {
        return Number(value);
    }

    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    return value;
}

export function expectInt(value: unknown): number {
    if (typeof value !== "number" || !Number.isInteger(value)) {
        throw new Error(`int 타입이 필요합니다: ${String(value)}`);
    }

    return value;
}
