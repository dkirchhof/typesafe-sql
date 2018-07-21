"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sanitizeValue(value) {
    if (typeof value === "string") {
        return `"${value}"`;
    }
    if (isColumn(value)) {
        return columnToString(value);
    }
    if (value !== undefined && value !== null) {
        return value.toString();
    }
    return null;
}
exports.sanitizeValue = sanitizeValue;
function convertValueToDB(column, valueOrColumn) {
    if (!isColumn(valueOrColumn) && column.converter) {
        return column.converter.toDB(valueOrColumn);
    }
    return valueOrColumn;
}
exports.convertValueToDB = convertValueToDB;
function convertValueToJS(column, valueOrColumn) {
    if (!isColumn(valueOrColumn) && column.converter) {
        return column.converter.toJS(valueOrColumn);
    }
    return valueOrColumn;
}
exports.convertValueToJS = convertValueToJS;
function columnToString(column) {
    const fullName = `${column.tableAlias}.${column.columnName}`;
    if (column.wrappedBy) {
        return `${column.wrappedBy[0]}${fullName}${column.wrappedBy[1]}`;
    }
    else {
        return fullName;
    }
}
exports.columnToString = columnToString;
function isColumn(column) {
    return column.dataType !== undefined;
}
exports.isColumn = isColumn;
function isWrappedColum(wrapper) {
    return wrapper.column !== undefined && wrapper.wrappedBy !== undefined;
}
exports.isWrappedColum = isWrappedColum;
