"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const utils_1 = require("../utils");
class InsertQuery {
    constructor(table, tuples) {
        this.table = table;
        if (Array.isArray(tuples)) {
            this.tuples = tuples;
        }
        else {
            this.tuples = [tuples];
        }
    }
    async execute(databaseProvider) {
        const { lastID } = await databaseProvider.execute(this.toSQL());
        return lastID;
    }
    toSQL() {
        const columns = Object.keys(this.tuples[0]).join(", ");
        const tuples = this.tuples.map(tuple => {
            const values = Object.entries(tuple).map(([column, value]) => {
                const sourceColumn = this.table.columns[column];
                const convertedValue = __1.convertValue(sourceColumn, value);
                const sanitizedValue = utils_1.sanitizeValue(convertedValue);
                return sanitizedValue;
            }).join(", ");
            return `(${values})`;
        }).join(", ");
        return `INSERT INTO ${this.table.tableName}(${columns})\n  VALUES${tuples}`;
    }
}
exports.InsertQuery = InsertQuery;
