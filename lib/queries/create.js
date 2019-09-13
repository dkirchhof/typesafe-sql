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
        const columns = Object.entries(this.table.columns).map(([columnName, options]) => {
            let sql = `${columnName} ${options.dataType}`;
            if (options.unique) {
                sql += ` UNIQUE`;
            }
            if (options.notNull) {
                sql += ` NOT NULL`;
            }
            if (options.references) {
                const foreignTable = options.references.table.tableName;
                const foreignColumn = options.references.column;
                const onDelete = options.references.onDelete || "NO ACTION";
                const onUpdate = options.references.onUpdate || "NO ACTION";
                sql += ` REFERENCES ${foreignTable}(${foreignColumn.toString()}) ON DELETE ${onDelete} ON UPDATE ${onUpdate}`;
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
