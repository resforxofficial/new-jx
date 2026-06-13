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
    value?: ExpressionNode;
}

export type ExpressionNode =
    | LiteralNode
    | IdentifierNode
    | BinaryExpressionNode;

export type StatementNode = VariableDeclarationNode;

export type ASTNode =
    | StatementNode
    | AssignmentNode
    | OutputStatementNode
    | IfStatementNode;

export interface BinaryExpressionNode {
    type: "BinaryExpression";
    operator: string;
    left: ExpressionNode;
    right: ExpressionNode;
}

export interface AssignmentNode {
    type: "Assignment";
    target: IdentifierNode;
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
