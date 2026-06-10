import type { AssignmentNode } from "../../ast/node";
import type { Parser } from "../parser";

export function parseAssignment(parser: Parser): AssignmentNode {
    const identifier = parser.expect("Identifier");
    parser.expect("Operator", "=");
    const value = parser.parseExpression();

    parser.expect("Punctuation", ";");

    return {
        type: "Assignment",
        target: {
            type: "Identifier",
            name: identifier.value,
        },
        value,
    }
}