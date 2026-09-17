import type { FunctionDeclarationNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseFunction(parser: Parser): FunctionDeclarationNode {
    parser.expect("Keyword", "block");
    const returnType = parser.expect("Type");

    let returnArray:
        | { elementType?: string; length?: number; }
        | undefined;

    if (parser.peek()?.type === "BracketOpen") {
        if (returnType.value === "void") {
            throw new Error("void 함수는 배열을 반환할 수 없습니다.");
        }

        parser.next();
        let length: number | undefined;

        if (parser.peek()?.type === "NumberLiteral") {
            length = Number(parser.next().value);
        }

        parser.expect("BracketClose");

        returnArray = {
            elementType: returnType.value,
            length,
        };
    }

    const name = parser.expect("Identifier");
    parser.expect("ParenOpen");

    const parameters: {
        type: string;
        name: string;
        array?: { elementType?: string; length?: number; };
    }[] = [];

    if (parser.peek()?.type !== "ParenClose") {
        while (true) {
            const parameterType = parser.expect("Type");

            let array:
                | {
                    elementType?: string;
                    length?: number;
                }
                | undefined;

            if (parser.peek()?.type === "BracketOpen") {
                parser.next();

                let length: number | undefined;

                if (parser.peek()?.type === "NumberLiteral") {
                    length = Number(parser.next().value);
                }

                parser.expect("BracketClose");

                array = {
                    elementType: parameterType.value,
                    length,
                };
            }

            const parameterName = parser.expect("Identifier");

            parameters.push({
                type: parameterType.value,
                name: parameterName.value,
                array,
            });

            if (
                parser.peek()?.type !== "Punctuation" ||
                parser.peek()?.value !== ","
            ) {
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
        returnArray,
        name: name.value,
        parameters,
        body,
    };
}
