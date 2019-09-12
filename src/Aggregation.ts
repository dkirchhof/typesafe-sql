import { Column } from "./Column";

export function avg<T extends Column<any>>(column: T) {
    return `AVG(${column})` as any as T;
}

export function count<T extends Column<any>>(column: T) {
    return `COUNT(${column})` as any as T;
}

export function max<T extends Column<any>>(column: T) {
    return `MAX(${column})` as any as T;
}

export function min<T extends Column<any>>(column: T) {
    return `MIN(${column})` as any as T;
}

export function sum<T extends Column<any>>(column: T) {
    return `SUM(${column})` as any as T;
}
