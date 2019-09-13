"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForeignKey {
    constructor(table, column, onDelete, onUpdate) {
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
        this.columns = columns;
    }
}
exports.Table = Table;
