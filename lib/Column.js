"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Column {
    constructor(name, options) {
        this.name = name;
        this.options = options;
        // just for the ts compiler
        this.type = undefined;
    }
    toString() {
        return this.name;
    }
}
exports.Column = Column;
class AliasedColumn extends Column {
    constructor(tableAlias, name, options) {
        super(name, options);
        this.tableAlias = tableAlias;
    }
    toString() {
        return `${this.tableAlias}.${this.name}`;
    }
}
exports.AliasedColumn = AliasedColumn;
