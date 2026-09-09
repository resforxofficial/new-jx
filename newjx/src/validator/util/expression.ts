import type { ExpressionNode } from "../../ast/node";
import type { Scope } from "../main";

export function getExpressionType(node: ExpressionNode, scope: Scope): string {
    switch (node.type) {
        case "Literal":
            if (typeof node.value === "number") {
                return "int";
            }

            if (typeof node.value === "string") {
                return "str";
            }

            if (typeof node.value === "boolean") {
                return "bool";
            }

            throw new Error("알 수 없는 리터럴 타입입니다.");

        case "Identifier":
            let currentScope: Scope | undefined = scope;

            while (currentScope) {
                const type = currentScope.declared.get(node.name);
                if (type) {
                    return type;
                }

                currentScope = currentScope.parent;
            }

            throw new Error(`선언되지 않은 변수입니다: ${node.name}`);

        case "BinaryExpression":
            return getBinaryExpressionType(node, scope);
    }
}

function getBinaryExpressionType(
    node: Extract<ExpressionNode, { type: "BinaryExpression" }>,
    scope: Scope,
): string {
    const leftType = getExpressionType(node.left, scope);
    const rightType = getExpressionType(node.right, scope);

    switch (node.operator) {
        case "+":
            if (leftType === "bool" || rightType === "bool") {
                throw new Error(`+ 연산에는 bool 타입을 사용할 수 없습니다.`);
            }

            if (leftType === "str" || rightType === "str") {
                return "str";
            }
            return "int";

        case "-":
        case "*":
            if (leftType === "str" && rightType === "int") {
                return "str";
            }

            if (leftType === "int" && rightType === "int") {
                return "int";
            }

            throw new Error(
                `* 연산을 사용할 수 없는 타입입니다: ${leftType} * ${rightType}`,
            );
        case "/":
            if (leftType !== "int" || rightType !== "int") {
                throw new Error(
                    `${node.operator} 연산은 int 타입만 사용할 수 있습니다.`,
                );
            }

            return "int";

        case "<":
        case ">":
        case "<=":
        case ">=":
        case "==":
        case "!=":
            if (leftType !== rightType) {
                throw new Error(
                    `비교할 수 없는 타입입니다: ${leftType} ${node.operator} ${rightType}`,
                );
            }

            return "bool";

        default:
            throw new Error(`알 수 없는 연산자입니다: ${node.operator}`);
    }
}
