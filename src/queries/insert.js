"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const __1 = require("..");
class InsertQuery {
    constructor(table, values) {
        this.table = table;
        this.values = values;
    }
    async execute(databaseProvider) {
        const { lastID } = await databaseProvider.execute(this.toSQL());
        return lastID;
    }
    toSQL() {
        const columns = Object.keys(this.values).join(", ");
        const values = Object.entries(this.values).map(([column, value]) => {
            const sourceColumn = this.table.columns[column];
            const convertedValue = __1.convertValue(sourceColumn, value);
            const sanitizedValue = utils_1.sanitizeValue(convertedValue);
            return sanitizedValue;
        }).join(", ");
        return `INSERT INTO ${this.table.tableName}(${columns}) VALUES(${values})`;
    }
}
exports.InsertQuery = InsertQuery;
