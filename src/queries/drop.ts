import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";

export class DropQuery {
    constructor(private readonly table: Table<any>) { }

    public async execute(databaseProvider: IDatabaseProvider) {
        await databaseProvider.execute(this.toSQL());
    }

    public toSQL() {
        return `DROP TABLE ${this.table.tableName}`;
    }
}
