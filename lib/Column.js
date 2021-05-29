"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliasedColumn = exports.Column = void 0;
class Column {
    name;
    options;
    // just for the ts compiler
    type = undefined;
    constructor(name, options) {
        this.name = name;
        this.options = options;
    }
    toString() {
        return this.name;
    }
}
exports.Column = Column;
class AliasedColumn extends Column {
    tableAlias;
    constructor(tableAlias, name, options) {
        super(name, options);
        this.tableAlias = tableAlias;
    }
    toString() {
        return `${this.tableAlias}.${this.name}`;
    }
}
exports.AliasedColumn = AliasedColumn;
