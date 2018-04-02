"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Column {
    constructor(column, wrappedBy) {
        this.column = column;
        this.wrappedBy = wrappedBy;
    }
    wrap(before, after) {
        this.wrappedBy = [before, after];
    }
    toString() {
        if (this.wrappedBy) {
            return `${this.wrappedBy[0]}${this.column}${this.wrappedBy[1]}`;
        }
        return this.column;
    }
}
exports.Column = Column;
class ProjectionColumn extends Column {
    toString() {
        const alias = this.wrappedBy ? ` AS ${this.column}` : "";
        return `${super.toString()}${alias}`;
    }
}
exports.ProjectionColumn = ProjectionColumn;
class OrderByColumn extends Column {
    constructor(column, direction, wrappedBy) {
        super(column, wrappedBy);
        this.direction = direction;
    }
    toString() {
        return `${super.toString()} ${this.direction}`;
    }
}
exports.OrderByColumn = OrderByColumn;
