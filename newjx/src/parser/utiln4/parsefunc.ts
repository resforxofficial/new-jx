import type { FunctionDeclarationNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseFunction(parser: Parser): FunctionDeclarationNode {
    parser.expect("Keyword", "block");

    const returnType = parser.expect("Type");
    const name = parser.expect("Identifier");

    parser.expect("ParenOpen");

    const parameters: { type: string; name: string }[] = [];

    if (parser.peek()?.type !== "ParenClose") {
        while (true) {
            const parameterType = parser.expect("Type");
            const parameterName = parser.expect("Identifier");

            parameters.push({
                type: parameterType.value,
                name: parameterName.value,
            });

            if (parser.peek()?.type !== "Punctuation" || parser.peek()?.value !== ",") {
                break;
            }

            parser.next();
        }
    }

    parser.expect("ParenClose");

    const body = parser.parseBlock();

    return {
        type: "FunctionDeclaration",
        returnType: returnType.value,
        name: name.value,
        parameters,
        body,
    };
}
