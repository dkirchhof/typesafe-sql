"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function select(aliasedTable1, attributes1, aliasedTable2, attributes2, aliasedTable3, attributes3, aliasedTable4, attributes4) {
    const tables = [];
    let attributes = [];
    const map = (table, selectedAttributes) => {
        if (table && selectedAttributes) {
            tables.push(table);
            const mapped = selectedAttributes.map(attribute => `${table.alias}.${attribute} AS ${table.alias}_${attribute}`);
            attributes = attributes.concat(mapped);
        }
    };
    map(aliasedTable1, attributes1);
    map(aliasedTable2, attributes2);
    map(aliasedTable3, attributes3);
    map(aliasedTable4, attributes4);
    return new Query(tables, attributes);
}
exports.select = select;
class Query {
    constructor(aliasedTables, attributes) {
        this.aliasedTables = aliasedTables;
        this.attributes = attributes;
        this.filters = [];
        this.orderParams = [];
    }
    where(table, key, value) {
        this.filters.push(`${table.alias}.${key} = ${utils_1.sanitizeValue(value)}`);
        return this;
    }
    joinOn(aliasedTable1, key1, aliasedTable2, key2) {
        this.filters.push(`${aliasedTable1.alias}.${key1} = ${aliasedTable2.alias}.${key2}`);
        return this;
    }
    orderBy(table, column, direction = "ASC") {
        this.orderParams.push(`${table.alias}_${column} ${direction}`);
        return this;
    }
    limit(limit) {
        this.limitParam = limit;
        return this;
    }
    async execute(databaseProvider) {
        const result = await databaseProvider.get(this.toSQL());
        const mappedResult = result.map(item => {
            const mappedItem = {};
            this.aliasedTables.forEach(aliasedTable => mappedItem[aliasedTable.alias] = {});
            const keys = Object.keys(item);
            keys.forEach(key => {
                const [, table, attribute] = key.match(/(.*)_(.*)/);
                mappedItem[table][attribute] = item[key];
            });
            return mappedItem;
        });
        return mappedResult;
    }
    toSQL() {
        let sql = `SELECT ${this.attributes.join(", ")} FROM ${this.aliasedTables.map(AliasedTable => `${AliasedTable.table.tableName} ${AliasedTable.alias}`).join(", ")}`;
        if (this.filters.length) {
            sql = `${sql} WHERE ${this.filters.join(" AND ")}`;
        }
        if (this.orderParams.length) {
            sql = `${sql} ORDER BY ${this.orderParams.join(" ,")}`;
        }
        if (this.limitParam !== undefined) {
            sql = `${sql} LIMIT ${this.limitParam}`;
        }
        return sql;
    }
}
exports.Query = Query;
//# sourceMappingURL=select.js.map