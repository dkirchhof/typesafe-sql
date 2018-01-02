"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Table {
    constructor(tableName) {
        this.tableName = tableName;
    }
}
exports.Table = Table;
class AliasedTable {
    constructor(table, alias) {
        this.table = table;
        this.alias = alias;
    }
}
exports.AliasedTable = AliasedTable;
//# sourceMappingURL=Table.js.map