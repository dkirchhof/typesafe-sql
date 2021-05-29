"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupBy = void 0;
class GroupBy {
    column;
    constructor(column) {
        this.column = column;
    }
    toString() {
        return `${this.column}`;
    }
}
exports.GroupBy = GroupBy;
