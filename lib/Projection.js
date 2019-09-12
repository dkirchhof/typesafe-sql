"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Projection {
    constructor(column, alias) {
        this.column = column;
        this.alias = alias;
    }
    toString() {
        return `${this.column} AS ${this.alias}`;
    }
}
exports.Projection = Projection;
