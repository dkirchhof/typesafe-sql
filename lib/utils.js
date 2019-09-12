"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sanitizeValue(value) {
    if (typeof value === "string") {
        return `"${value}"`;
    }
    if (value !== undefined && value !== null) {
        return value.toString();
    }
    return "null";
}
exports.sanitizeValue = sanitizeValue;
function convertValueToDB(column, valueOrColumn) {
    if (!isColumn(valueOrColumn) && column.converter) {
        return column.converter.toDB(valueOrColumn);
    }
    return valueOrColumn;
}
exports.convertValueToDB = convertValueToDB;
function convertValueToJS(column, value) {
    if (column.converter) {
        return column.converter.toJS(value);
    }
    return value;
}
exports.convertValueToJS = convertValueToJS;
function isColumn(column) {
    return column.dataType !== undefined;
}
exports.isColumn = isColumn;
function isWrappedColum(wrapper) {
    return wrapper.column !== undefined && wrapper.wrappedBy !== undefined;
}
exports.isWrappedColum = isWrappedColum;
