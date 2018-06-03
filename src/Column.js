"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
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
class FilterColumn extends Column {
    constructor(column, operator, value, wrappedBy) {
        super(column, wrappedBy);
        this.operator = operator;
        this.value = value;
    }
    toString() {
        const convertedValueOrColumn = _1.convertValue(this.column, this.value);
        const sanitizedValueOrColumn = _1.sanitizeValue(convertedValueOrColumn);
        return `${super.toString()} ${this.operator} ${sanitizedValueOrColumn}`;
    }
}
exports.FilterColumn = FilterColumn;
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
