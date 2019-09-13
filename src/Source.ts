import { Table } from ".";

export class Source {
    constructor(protected table: Table<any>) { }

    public toString() {
        return this.table.tableName;
    }
}
export class AliasedSource extends Source {
    constructor(table: Table<any>, private alias: string) { 
        super(table);
    }

    public toString() {
        return `${this.table.tableName} AS ${this.alias}`;
    }
}
