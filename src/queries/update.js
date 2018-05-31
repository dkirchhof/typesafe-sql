"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const utils_1 = require("../utils");
class UpdateQuery {
    constructor(table, values) {
        this.table = table;
        this.values = values;
        this.filters = [];
    }
    where(column, operator, value) {
        this.filters.push({ column, operator, value });
        return this;
    }
    async execute(databaseProvider) {
        const { changes } = await databaseProvider.execute(this.toSQL());
        return changes;
    }
    toSQL() {
        const values = Object.entries(this.values).map(([column, value]) => {
            const sourceColumn = this.table.columns[column];
            const convertedValue = __1.convertValue(sourceColumn, value);
            const sanitizedValue = utils_1.sanitizeValue(convertedValue);
            return `${column} = ${sanitizedValue}`;
        }).join(", ");
        let sql = `UPDATE ${this.table.tableName}\n  SET ${values}`;
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
exports.UpdateQuery = UpdateQuery;
