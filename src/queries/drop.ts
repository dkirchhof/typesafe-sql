import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";

export function dropTable(table: Table<any>) {
    return new DropQuery(table);
}

class DropQuery {
    constructor(private readonly table: Table<any>) { }

    public execute(databaseProvider: IDatabaseProvider) {
        return databaseProvider.execute(this.toSQL());
    }

    public toSQL() {
        return `DROP TABLE ${this.table.tableName}`;
    }
}
