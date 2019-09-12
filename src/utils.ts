import { IExtendedColumnOptions, IWrappedColumn } from "./Table";

export function sanitizeValue(value: any): string | null {
    if (typeof value === "string") {
        return `"${value}"`;
    }

    if (value !== undefined && value !== null) {
        return value.toString();
    }

    return "null";
}

export function convertValueToDB(column: IExtendedColumnOptions<any>, valueOrColumn: any) {
    if (!isColumn(valueOrColumn)  && column.converter) {
        return column.converter.toDB(valueOrColumn);
    }

    return valueOrColumn;
}

export function convertValueToJS(column: IExtendedColumnOptions<any>, value: any) {
    if (column.converter) {
        return column.converter.toJS(value);
    }

    return value;
}

export function isColumn(column: any): column is IExtendedColumnOptions<any> {
    return (column as IExtendedColumnOptions<any>).dataType !== undefined;
}

export function isWrappedColum(wrapper: any): wrapper is IWrappedColumn<any> {
    return (wrapper as IWrappedColumn<any>).column !== undefined && (wrapper as IWrappedColumn<any>).wrappedBy !== undefined;
}
