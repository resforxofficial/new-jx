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

        case "InputExpression":
            return "dynamic";

        case "BinaryExpression":
            return getBinaryExpressionType(node, scope);

        case "ArrayLiteral":
            if (node.elements.length === 0) {
                return "array";
            }

            const firstType = getExpressionType(node.elements[0], scope);
            for (const element of node.elements) {
                const elementType = getExpressionType(element, scope);

                if (elementType !== firstType) {
                    throw new Error(`배열 요소의 타입이 일치하지 않습니다: ${firstType} ← ${elementType}`);
                }
            }

            return "array";

        case "IndexExpression":
            const targetType = getExpressionType(node.target, scope);
            const indexType = getExpressionType(node.index, scope);

            if (!targetType.endsWith("[]")) {
                throw new Error(`배열이 아닌 값은 인덱싱할 수 없습니다: ${targetType}`);
            }

            if (indexType !== "int") {
                throw new Error(`배열 인덱스는 int 타입이어야 합니다: ${indexType}`);
            }

            return targetType.slice(0, -2);

        case "TernaryExpression":
            const conditionType = getExpressionType(node.condition, scope);

            if (conditionType !== "bool" && conditionType !== "dynamic") {
                throw new Error(`삼항 연산자의 조건은 bool 타입이어야 합니다: ${conditionType}`);
            }

            const consequentType = getExpressionType(node.consequent, scope);
            const alternateType = getExpressionType(node.alternate, scope);

            if (consequentType === "dynamic" || alternateType === "dynamic") {
                return "dynamic";
            }

            if (consequentType !== alternateType) {
                throw new Error(`삼항 연산자의 결과 타입이 일치하지 않습니다: ${consequentType} ← ${alternateType}`);
            }

            return consequentType;

        case "UnaryExpression":
            const operandType = getExpressionType(node.operand, scope);

            if (node.operator === "!") {
                if (operandType !== "bool" && operandType !== "dynamic") {
                    throw new Error(`! 연산자는 bool 타입만 사용할 수 있습니다: ${operandType}`);
                }

                return "bool";
            }

            if (operandType !== "int" && operandType !== "dynamic") {
                throw new Error(`${node.operator} 연산자는 int 타입만 사용할 수 있습니다: ${operandType}`);
            }

            return operandType;

        case "CallExpression":
            if (node.callee.type !== "Identifier") {
                throw new Error("함수 호출 대상은 함수 이름이어야 합니다.");
            }

            const name = node.callee.name;
            let currentScope1: Scope | undefined = scope;
            let functionInfo;

            while (currentScope1) {
                functionInfo = currentScope1.functions.get(name);
                if (functionInfo) {
                    break;
                }

                currentScope1 = currentScope1.parent;
            }

            if (!functionInfo) {
                throw new Error(`선언되지 않은 함수입니다: ${name}`);
            }

            if (node.arguments.length !== functionInfo.parameters.length) {
                throw new Error(`함수 인자의 개수가 일치하지 않습니다: ${name} (필요 ${functionInfo.parameters.length}, 전달 ${node.arguments.length})`);
            }

            for (let i = 0; i < node.arguments.length; i++) {
                const actualType = getExpressionType(node.arguments[i], scope);
                const expectedType = functionInfo.parameters[i].type;

                if (actualType !== "dynamic" && expectedType !== "dynamic" && actualType !== expectedType) {
                    throw new Error(`함수 인자의 타입이 일치하지 않습니다: ${name} (${expectedType} ← ${actualType})`);
                }
            }

            return functionInfo.returnType;
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

            if (leftType === "dynamic" || rightType === "dynamic") {
                return "dynamic";
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
            if (leftType !== "dynamic" && rightType !== "dynamic" && leftType !== rightType) {
                throw new Error(
                    `비교할 수 없는 타입입니다: ${leftType} ${node.operator} ${rightType}`,
                );
            }

            return "bool";

        default:
            throw new Error(`알 수 없는 연산자입니다: ${node.operator}`);
    }
}
