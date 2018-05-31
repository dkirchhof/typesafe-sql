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
function convertValue(column, valueOrColumn) {
    if (!isColumn(valueOrColumn) && column.converter) {
        return column.converter.toDB(valueOrColumn);
    }
    return valueOrColumn;
}
exports.convertValue = convertValue;
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
// export function wrappedColumn<T>(strings: TemplateStringsArray, column: IExtendedColumnOptions<T>): IExtendedColumnOptions<T>
// {
// 	const copy = JSON.parse(JSON.stringify(column));
// 	copy.wrappedBy = [...strings];
// 	return copy;
// }
// export function wrap<TableType>(strings: TemplateStringsArray, column: keyof TableType): WrappedColumn<TableType>
// {
// 	return { column, wrappedBy: [...strings] };
// }
