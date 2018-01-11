"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sanitizeValue(value) {
    if (typeof value === "string") {
        return `"${value}"`;
    }
    else if (value instanceof Date) {
        return `"${value.toISOString()}"`;
    }
    else if (isColumn(value)) {
        return columnToString(value);
    }
    else if (value !== undefined && value !== null) {
        return value.toString();
    }
    return null;
}
exports.sanitizeValue = sanitizeValue;
function columnToString(column) {
    return `${column.tableAlias}.${column.columnName}`;
}
exports.columnToString = columnToString;
function isColumn(column) {
    return column.dataType !== undefined;
}
exports.isColumn = isColumn;
