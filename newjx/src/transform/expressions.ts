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
    }
}
