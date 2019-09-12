export declare class Column<Type> {
    private readonly tableAlias;
    private readonly columnName;
    private type?;
    constructor(tableAlias: string, columnName: string);
    toString(): string;
}
