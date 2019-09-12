import { Table } from ".";

export class Source {
    constructor(public table: Table<any>, private alias: string) { }

    public toString() {
        return `${this.table.tableName} AS ${this.alias}`;
    }
}
