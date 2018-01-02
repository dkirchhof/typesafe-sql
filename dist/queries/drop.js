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
    async execute(databaseProvider) {
        await databaseProvider.execute(this.toSQL());
    }
    toSQL() {
        return `DROP TABLE ${this.table.tableName}`;
    }
}
exports.DropQuery = DropQuery;
//# sourceMappingURL=drop.js.map