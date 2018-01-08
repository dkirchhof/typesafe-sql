"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForeignKey {
    constructor(table, column, onDelete = "NO ACTION", onUpdate = "NO ACTION") {
        this.table = table;
        this.column = column;
        this.onDelete = onDelete;
        this.onUpdate = onUpdate;
    }
}
exports.ForeignKey = ForeignKey;
class Table {
    constructor(tableName, columns) {
        this.tableName = tableName;
        Object.entries(columns).forEach(([key, value]) => value.columnName = key);
        this.columns = columns;
    }
}
exports.Table = Table;
//# sourceMappingURL=Table.js.map