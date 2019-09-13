export class Column<Type> {
    // just for the ts compiler
    private type?: Type = undefined;

    constructor(protected readonly columnName: string) { }

    public toString() {
        return this.columnName;
    }
}

export class AliasedColumn<Type> extends Column<Type> {
    constructor(private readonly tableAlias: string, columnName: string) { 
        super(columnName);
    }

    public toString() {
        return `${this.tableAlias}.${this.columnName}`;
    }
}
