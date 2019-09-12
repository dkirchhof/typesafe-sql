"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Column {
    constructor(tableAlias, columnName) {
        this.tableAlias = tableAlias;
        this.columnName = columnName;
        // just for the ts compiler
        this.type = undefined;
    }
    toString() {
        return `${this.tableAlias}.${this.columnName}`;
    }
}
exports.Column = Column;
