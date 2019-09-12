"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Source {
    constructor(table, alias) {
        this.table = table;
        this.alias = alias;
    }
    toString() {
        return `${this.table.tableName} AS ${this.alias}`;
    }
}
exports.Source = Source;
