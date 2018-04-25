"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const __1 = require("..");
class DeleteQuery {
    constructor(table) {
        this.table = table;
        this.filters = [];
    }
    where(column, operator, value) {
        this.filters.push({ column, value, operator });
        return this;
    }
    async execute(databaseProvider) {
        const { changes } = await databaseProvider.execute(this.toSQL());
        return changes;
    }
    toSQL() {
        let sql = `DELETE FROM ${this.table.tableName}`;
        if (this.filters.length) {
            const filters = this.filters.map(filter => {
                const sourceColumn = this.table.columns[filter.column];
                const convertedValue = __1.convertValue(sourceColumn, filter.value);
                const sanitizedValue = utils_1.sanitizeValue(convertedValue);
                return `${filter.column} ${filter.operator} ${sanitizedValue}`;
            }).join(" AND ");
            sql = `${sql}\n  WHERE ${filters}`;
        }
        return sql;
    }
}
exports.DeleteQuery = DeleteQuery;
