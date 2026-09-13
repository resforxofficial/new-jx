export interface LiteralNode {
    type: "Literal";
    value: string | number | boolean;
}

export interface IdentifierNode {
    type: "Identifier";
    name: string;
}

export interface VariableDeclarationNode {
    type: "VariableDeclaration";
    name: string;
    mutable: boolean;
    varType?: string;
    array?: ArrayTypeNode;
    value?: ExpressionNode;
}

export type ExpressionNode =
    | LiteralNode
    | IdentifierNode
    | InputExpressionNode
    | TernaryExpressionNode
    | IndexExpressionNode
    | UnaryExpressionNode
    | ArrayLiteralNode
    | BinaryExpressionNode;

export type StatementNode = VariableDeclarationNode;

export type ASTNode =
    | StatementNode
    | AssignmentNode
    | BreakStatementNode
    | ContinueStatementNode
    | OutputStatementNode
    | IfStatementNode
    | WhileStatementNode
    | ForOfStatementNode
    | ForStatementNode;

export interface BinaryExpressionNode {
    type: "BinaryExpression";
    operator: string;
    left: ExpressionNode;
    right: ExpressionNode;
}

export interface AssignmentNode {
    type: "Assignment";
    target: IdentifierNode | IndexExpressionNode;
    operator: "=" | "+=" | "-=" | "*=" | "/=";
    value: ExpressionNode;
}

export interface OutputStatementNode {
    type: "OutputStatement";
    expressions: ExpressionNode[];
}

export interface IfStatementNode {
    type: "IfStatement";
    test: ExpressionNode;
    consequent: ASTNode[];
    alternate?: ASTNode[];
}

export interface WhileStatementNode {
    type: "WhileStatement";
    test: ExpressionNode;
    body: ASTNode[];
}

export interface ForStatementNode {
    type: "ForStatement";
    init: VariableDeclarationNode;
    test: ExpressionNode;
    updateOperator: "+" | "-";
    iteratorName: string;
    body: ASTNode[];
}

export interface InputExpressionNode {
    type: "InputExpression";
    promptText: string;
}

export interface BreakStatementNode {
    type: "BreakStatement";
}

export interface ContinueStatementNode {
    type: "ContinueStatement";
}

export interface ArrayLiteralNode {
    type: "ArrayLiteral";
    elements: ExpressionNode[];
}

export interface ArrayTypeNode {
    elementType?: string;
    length?: number;
}

export interface IndexExpressionNode {
    type: "IndexExpression";
    target: ExpressionNode;
    index: ExpressionNode;
}

export interface ForOfStatementNode {
    type: "ForOfStatement";
    varType?: string;
    iteratorName: string;
    iterable: ExpressionNode;
    body: ASTNode[];
}

export interface TernaryExpressionNode {
    type: "TernaryExpression";
    condition: ExpressionNode;
    consequent: ExpressionNode;
    alternate: ExpressionNode;
}

export interface UnaryExpressionNode {
    type: "UnaryExpression";
    operator: "+" | "-" | "!";
    operand: ExpressionNode;
}
