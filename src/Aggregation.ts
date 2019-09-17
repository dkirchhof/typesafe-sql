import { Column } from "./Column";

export function avg<T>(column: Column<T>) {
    return new Column<T>(`AVG(${column})`, column.options);
}

export function count<T>(column: Column<T>) {
    return new Column<T>(`COUNT(${column})`, column.options);
}

export function max<T>(column: Column<T>) {
    return new Column<T>(`MAX(${column})`, column.options);
}

export function min<T>(column: Column<T>) {
    return new Column<T>(`MIN(${column})`, column.options);
}

export function sum<T>(column: Column<T>) {
    return new Column<T>(`SUM(${column})`, column.options);
}
