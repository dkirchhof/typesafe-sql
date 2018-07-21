import { IExtendedColumnOptions, IWrappedColumn } from "./Table";

export function sanitizeValue(value: any): string | null {
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

export function convertValueToDB(column: IExtendedColumnOptions<any>, valueOrColumn: any) {
    if (!isColumn(valueOrColumn)  && column.converter) {
        return column.converter.toDB(valueOrColumn);
    }

    return valueOrColumn;
}

export function convertValueToJS(column: IExtendedColumnOptions<any>, valueOrColumn: any) {
    if (!isColumn(valueOrColumn)  && column.converter) {
        return column.converter.toJS(valueOrColumn);
    }

    return valueOrColumn;
}

export function columnToString(column: IExtendedColumnOptions<any>) {
    const fullName = `${column.tableAlias}.${column.columnName}`;

    if (column.wrappedBy) {
        return `${column.wrappedBy[0]}${fullName}${column.wrappedBy[1]}`;
    } else {
        return fullName;
    }
}

export function isColumn(column: any): column is IExtendedColumnOptions<any> {
    return (column as IExtendedColumnOptions<any>).dataType !== undefined;
}

export function isWrappedColum(wrapper: any): wrapper is IWrappedColumn<any> {
    return (wrapper as IWrappedColumn<any>).column !== undefined && (wrapper as IWrappedColumn<any>).wrappedBy !== undefined;
}
