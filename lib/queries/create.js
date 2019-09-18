"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createTable(table) {
    return new CreateQuery(table);
}
exports.createTable = createTable;
class CreateQuery {
    constructor(table) {
        this.table = table;
    }
    execute(databaseProvider) {
        return databaseProvider.execute(this.toSQL());
    }
    toSQL() {
        const openStmt = `CREATE TABLE ${this.table.tableName} (`;
        const columns = this.columnsToSQL().join(",\n  ");
        const constraints = this.table.constraints.join(",\n  ");
        const centerParts = [columns, constraints].filter(Boolean).join(",\n  ");
        return `${openStmt}\n  ${centerParts}\n)`;
    }
    columnsToSQL() {
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
