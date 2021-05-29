"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBy = void 0;
class OrderBy {
    column;
    direction;
    constructor(column, direction) {
        this.column = column;
        this.direction = direction;
    }
    toString() {
        return `${this.column} ${this.direction}`;
    }
}
exports.OrderBy = OrderBy;
