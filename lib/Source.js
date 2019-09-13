"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Source {
    constructor(table) {
        this.table = table;
    }
    toString() {
        return this.table.tableName;
    }
}
exports.Source = Source;
class AliasedSource extends Source {
    constructor(table, alias) {
        super(table);
        this.alias = alias;
    }
    toString() {
        return `${this.table.tableName} AS ${this.alias}`;
    }
}
exports.AliasedSource = AliasedSource;
