export class Column<Type> {
    // just for the ts compiler
    private type?: Type = undefined;

    constructor(private readonly tableAlias: string, private readonly columnName: string) { }

    public toString() {
        return `${this.tableAlias}.${this.columnName}`;
    }
}
