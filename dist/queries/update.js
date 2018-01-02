"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function update(table) {
    return new UpdateQuery(table);
}
exports.update = update;
class UpdateQuery {
    constructor(table) {
        this.table = table;
        this.filters = [];
    }
    set(values) {
        this.values = Object.keys(values).map((key) => `${key} = ${utils_1.sanitizeValue(values[key])}`);
        return this;
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
        let sql = `UPDATE ${this.table.tableName} SET ${this.values.join(", ")}`;
        if (this.filters.length) {
            sql = `${sql} WHERE ${this.filters.join(" AND ")}`;
        }
        return sql;
    }
}
exports.UpdateQuery = UpdateQuery;
//# sourceMappingURL=update.js.map