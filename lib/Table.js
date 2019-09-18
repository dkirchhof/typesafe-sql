"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForeignKey {
    constructor(tableSelector, column, onDelete = "NO ACTION", onUpdate = "NO ACTION") {
        this.column = column;
        this.onDelete = onDelete;
        this.onUpdate = onUpdate;
        this.table = tableSelector();
    }
    toString() {
        return `REFERENCES ${this.table.tableName}(${this.column}) ON DELETE ${this.onDelete} ON UPDATE ${this.onUpdate}`;
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
