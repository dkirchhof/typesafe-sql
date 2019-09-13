import { Column } from "./Column";

export function avg<T>(column: T) {
    return new Column<T>(`AVG(${column})`);
}

export function count<T>(column: Column<T>) {
    return new Column<T>(`COUNT(${column})`);
}

export function max<T>(column: T) {
    return new Column<T>(`MAX(${column})`);
}

export function min<T>(column: T) {
    return new Column<T>(`MIN(${column})`);
}

export function sum<T>(column: T) {
    return new Column<T>(`SUM(${column})`);
}
