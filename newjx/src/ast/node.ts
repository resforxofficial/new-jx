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
    | IdentifierNode;

export type StatementNode =
    | VariableDeclarationNode;

export type ASTNode =
    | StatementNode;