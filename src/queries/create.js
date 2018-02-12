"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CreateQuery {
    constructor(table) {
        this.table = table;
    }
    async execute(databaseProvider) {
        return databaseProvider.execute(this.toSQL());
    }
    toSQL() {
        const columns = Object.values(this.table.columns).map(column => {
            let string = `${column.columnName} ${column.dataType}`;
            if (column.unique) {
                string += ` UNIQUE`;
            }
            if (column.notNull) {
                string += ` NOT NULL`;
            }
            if (column.references) {
                const foreignTable = column.references.table.tableName;
                const foreignColumn = column.references.column;
                const onDelete = column.references.onDelete || "NO ACTION";
                const onUpdate = column.references.onUpdate || "NO ACTION";
                string += ` REFERENCES ${foreignTable}(${foreignColumn}) ON DELETE ${onDelete} ON UPDATE ${onUpdate}`;
            }
            return string;
        });
        let primaryConstraint = "";
        const primaryColumns = Object.values(this.table.columns).filter(column => column.primary);
        if (primaryColumns.length) {
            primaryConstraint = `,\n\tPRIMARY KEY (${primaryColumns.map(column => column.columnName).join(", ")})`;
        }
        return `CREATE TABLE ${this.table.tableName} (\n\t${columns.join(",\n\t")}${primaryConstraint}\n)`;
    }
}
exports.CreateQuery = CreateQuery;