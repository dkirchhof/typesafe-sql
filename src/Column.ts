import { IColumnOptions } from "./Table";

export class Column<Type> {
    // just for the ts compiler
    private type?: Type = undefined;

    constructor(public readonly name: string, public readonly options: IColumnOptions<any>) { }

    public toString() {
        return this.name;
    }
}

export class AliasedColumn<Type> extends Column<Type> {
    constructor(public readonly tableAlias: string, name: string, options: IColumnOptions<any>) { 
        super(name, options);
    }

    public toString() {
        return `${this.tableAlias}.${this.name}`;
    }
}
