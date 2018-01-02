"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function insertInto(table) {
    return new InsertQuery(table);
}
exports.insertInto = insertInto;
class InsertQuery {
    constructor(table) {
        this.table = table;
    }
    values(values) {
        this.keyList = Object.keys(values);
        this.valueList = Object.values(values).map(value => utils_1.sanitizeValue(value));
        return this;
    }
    async execute(databaseProvider) {
        const { lastID } = await databaseProvider.execute(this.toSQL());
        return lastID;
    }
    toSQL() {
        return `INSERT INTO ${this.table.tableName}(${this.keyList.join(", ")}) VALUES(${this.valueList.join(", ")})`;
    }
}
exports.InsertQuery = InsertQuery;
//# sourceMappingURL=insert.js.map