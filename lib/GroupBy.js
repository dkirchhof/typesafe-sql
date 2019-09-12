"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GroupBy {
    constructor(column) {
        this.column = column;
    }
    toString() {
        return `${this.column}`;
    }
}
exports.GroupBy = GroupBy;
