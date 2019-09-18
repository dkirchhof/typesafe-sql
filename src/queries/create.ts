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
        const columns = Object.entries(this.table.columns).map(([columnName, options]) => {
            let sql = `${columnName} ${options.dataType}`;

            if (options.unique) {
                sql += ` UNIQUE`;
            }

            if (options.notNull) {
                sql += ` NOT NULL`;
            }

            if (options.references) {
                sql += ` ${options.references}`;
            }

            return sql;
        });

        let primaryConstraint = "";
        const primaryColumns = Object.entries(this.table.columns).filter(([, options]) => options.primary);

        if (primaryColumns.length) {
            primaryConstraint = `,\n  PRIMARY KEY (${primaryColumns.map(([columnName]) => columnName).join(", ")})`;
        }

        return `CREATE TABLE ${this.table.tableName} (\n  ${columns.join(",\n  ")}${primaryConstraint}\n)`;
    }
}
