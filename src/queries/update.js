"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class UpdateQuery {
    constructor(table, values) {
        this.table = table;
        this.values = values;
        this.filters = [];
    }
    where(column, value) {
        this.filters.push({ column, value });
        return this;
    }
    async execute(databaseProvider) {
        const { changes } = await databaseProvider.execute(this.toSQL());
        return changes;
    }
    toSQL() {
        const values = Object.entries(this.values).map(([key, value]) => `${key} = ${utils_1.sanitizeValue(value)}`).join(", ");
        let sql = `UPDATE ${this.table.tableName} SET ${values}`;
        if (this.filters.length) {
            const filters = this.filters.map(filter => `${filter.column} = ${utils_1.sanitizeValue(filter.value)}`).join(" AND ");
            sql = `${sql} WHERE ${filters}`;
        }
        return sql;
    }
}
exports.UpdateQuery = UpdateQuery;
