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

    parser.expect("Operator", "=");
    const value = parser.parseExpression();
    parser.expect("Punctuation", ";");

    return {
        type: "Assignment",
        target,
        value,
    };
}
