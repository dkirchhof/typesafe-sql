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
        const name = `${this.column.tableAlias}.${this.column.columnName}`;
        return this.wrappedBy ? `${this.wrappedBy[0]}${name}${this.wrappedBy[1]}` : name;
    }
}
exports.Column = Column;
class ProjectionColumn extends Column {
    constructor(column, alias, wrappedBy) {
        super(column, wrappedBy);
        this.alias = alias;
    }
    toString() {
        return `${super.toString()} AS ${this.alias}`;
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
