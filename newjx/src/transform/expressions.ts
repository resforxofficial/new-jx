import type { ExpressionNode } from "../ast/node";

export function transformExpression(node: ExpressionNode): string {
    switch (node.type) {
        case "Literal":
            return typeof node.value === "string"
                ? `"${node.value}"`
                : String(node.value);

        case "Identifier":
            return node.name;

        case "BinaryExpression":
            return `${transformExpression(node.left)} ${node.operator} ${transformExpression(node.right)}`;

        case "InputExpression":
            return `input("${node.promptText}")`;

        case "ArrayLiteral":
            return `[${node.elements.map(element => transformExpression(element)).join(", ")}]`;

        case "IndexExpression":
            return `${transformExpression(node.target)}[expectInt(${transformExpression(node.index)})]`;

        case "TernaryExpression":
            return `(${transformExpression(node.condition)} ? ${transformExpression(node.consequent)} : ${transformExpression(node.alternate)})`;

        case "UnaryExpression":
            const operand = transformExpression(node.operand);

            if (node.operand.type === "BinaryExpression") {
                return `${node.operator}(${operand})`;
            }

            return `${node.operator}${operand}`;

        case "CallExpression":
            return `${transformExpression(node.callee)}(${node.arguments
                .map(argument => transformExpression(argument))
                .join(", ")})`;
    }
}
