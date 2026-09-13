import type { AssignmentNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseAssignment(parser: Parser): AssignmentNode {
    const identifier = parser.expect("Identifier");

    let target: AssignmentNode["target"] = {
        type: "Identifier",
        name: identifier.value,
    };

    if (parser.peek()?.type === "BracketOpen") {
        parser.next();

        const index = parser.parseExpression();

        parser.expect("BracketClose");

        target = {
            type: "IndexExpression",
            target,
            index,
        };
    }

    const operator = parser.expect("Operator");

    if (!["=", "+=", "-=", "*=", "/="].includes(operator.value)) {
        throw new Error(`잘못된 대입 연산자입니다: ${operator.value}`);
    }

    const value = parser.parseExpression();

    parser.expect("Punctuation", ";");

    return {
        type: "Assignment",
        target,
        operator: operator.value as "=" | "+=" | "-=" | "*=" | "/=",
        value,
    };
}
