"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function deleteFrom(table) {
    return new DeleteQuery(table);
}
exports.deleteFrom = deleteFrom;
class DeleteQuery {
    constructor(table) {
        this.table = table;
        this.filters = [];
    }
    where(key, value) {
        this.filters.push(`${key} = ${utils_1.sanitizeValue(value)}`);
        return this;
    }
    async execute(databaseProvider) {
        const { changes } = await databaseProvider.execute(this.toSQL());
        return changes;
    }
    toSQL() {
        let sql = `DELETE FROM ${this.table.tableName}`;
        if (this.filters.length) {
            sql = `${sql} WHERE ${this.filters.join(" AND ")}`;
        }
        return sql;
    }
}
exports.DeleteQuery = DeleteQuery;
//# sourceMappingURL=delete.js.map