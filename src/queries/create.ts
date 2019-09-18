import { IDatabaseProvider } from "../providers/IDatabaseProvider";
import { Table } from "../Table";

export function createTable(table: Table<any>) {
    return new CreateQuery(table);
}

class CreateQuery {
    constructor(private readonly table: Table<any>) { }

    public execute(databaseProvider: IDatabaseProvider) {
        return databaseProvider.execute(this.toSQL());
    }

    public toSQL() {
        const openStmt = `CREATE TABLE ${this.table.tableName} (`;

        const columns = this.columnsToSQL().join(",\n  ");
        const constraints = this.table.constraints.join(",\n  ");

        const centerParts = [columns, constraints].filter(Boolean).join(",\n  ");

        return `${openStmt}\n  ${centerParts}\n)`;
    }

    private columnsToSQL() {
        return Object.entries(this.table.columns).map(([columnName, options]) => {
            let sql = `${columnName} ${options.dataType}`;

            if (options.unique) {
                sql += ` UNIQUE`;
            }

            if (options.nullable !== false) {
                sql += ` NOT NULL`;
            }

            return sql;
        });
    }
}
