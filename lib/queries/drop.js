"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dropTable(table) {
    return new DropQuery(table);
}
exports.dropTable = dropTable;
class DropQuery {
    constructor(table) {
        this.table = table;
    }
    execute(databaseProvider) {
        return databaseProvider.execute(this.toSQL());
    }
    toSQL() {
        return `DROP TABLE ${this.table.tableName}`;
    }
}
