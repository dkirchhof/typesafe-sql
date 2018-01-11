"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
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
        const values = Object.values(this.values).map(value => utils_1.sanitizeValue(value)).join(", ");
        return `INSERT INTO ${this.table.tableName}(${columns}) VALUES(${values})`;
    }
}
exports.InsertQuery = InsertQuery;
