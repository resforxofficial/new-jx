export interface TransformScope {
    declared: Map<string, string>;
    parent?: TransformScope;
}

export function createTransformScope(parent?: TransformScope): TransformScope {
    return {
        declared: new Map(),
        parent
    };
}

export function getTransformType(scope: TransformScope, name: string): string | undefined {
    let currentScope: TransformScope | undefined = scope;

    while (currentScope) {
        const type = currentScope.declared.get(name);

        if (type) {
            return type;
        }

        currentScope = currentScope.parent;
    }

    return undefined;
}
