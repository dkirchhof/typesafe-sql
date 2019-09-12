"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OrderBy {
    constructor(column, direction) {
        this.column = column;
        this.direction = direction;
    }
    toString() {
        return `${this.column} ${this.direction}`;
    }
}
exports.OrderBy = OrderBy;
