"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projection = void 0;
class Projection {
    column;
    alias;
    constructor(column, alias) {
        this.column = column;
        this.alias = alias;
    }
    toString() {
        return `${this.column} AS ${this.alias}`;
    }
}
exports.Projection = Projection;
