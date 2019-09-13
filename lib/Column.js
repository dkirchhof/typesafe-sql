"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Column {
    constructor(columnName) {
        this.columnName = columnName;
        // just for the ts compiler
        this.type = undefined;
    }
    toString() {
        return this.columnName;
    }
}
exports.Column = Column;
class AliasedColumn extends Column {
    constructor(tableAlias, columnName) {
        super(columnName);
        this.tableAlias = tableAlias;
    }
    toString() {
        return `${this.tableAlias}.${this.columnName}`;
    }
}
exports.AliasedColumn = AliasedColumn;
