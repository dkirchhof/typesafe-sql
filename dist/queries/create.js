"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createTable(table) {
    return new CreateQuery(table);
}
exports.createTable = createTable;
class ForeignKey {
    constructor(table, column, onDelete = "NO ACTION", onUpdate = "NO ACTION") {
        this.table = table;
        this.column = column;
        this.onDelete = onDelete;
        this.onUpdate = onUpdate;
    }
}
exports.ForeignKey = ForeignKey;
class CreateQuery {
    constructor(table) {
        this.table = table;
        this.columnList = [];
        this.primaryList = [];
        this.foreignList = [];
    }
    columns(columns) {
        Object.keys(columns).forEach((column) => {
            const columnOptions = columns[column];
            let string = `${column} ${columnOptions.dataType}`;
            if (columnOptions.unique !== undefined) {
                string += ` UNIQUE`;
            }
            if (columnOptions.notNull !== undefined) {
                string += ` NOT NULL`;
            }
            if (columnOptions.foreign !== undefined) {
                const table = columnOptions.foreign.table.tableName;
                const column = columnOptions.foreign.column;
                const onDelete = columnOptions.foreign.onDelete;
                const onUpdate = columnOptions.foreign.onUpdate;
                string += ` REFERENCES ${table}(${column}) ON DELETE ${onDelete} ON UPDATE ${onUpdate}`;
            }
            this.columnList.push(string);
            if (columnOptions.primary) {
                this.primaryList.push(column);
            }
        });
        return this;
    }
    async execute(databaseProvider) {
        return databaseProvider.execute(this.toSQL());
    }
    toSQL() {
        let primaryConstraint = "";
        if (this.primaryList.length) {
            primaryConstraint = `, PRIMARY KEY (${this.primaryList.join(", ")})`;
        }
        return `CREATE TABLE ${this.table.tableName} (${this.columnList.join(", ")}${primaryConstraint})`;
    }
}
exports.CreateQuery = CreateQuery;
//# sourceMappingURL=create.js.map