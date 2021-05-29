"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropTable = void 0;
function dropTable(table) {
    return new DropQuery(table);
}
exports.dropTable = dropTable;
class DropQuery {
    table;
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
