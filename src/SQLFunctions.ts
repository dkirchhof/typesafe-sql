import { IWrappedColumn } from ".";

export function AVG(column: any) {
    return { column, wrappedBy: ["AVG(", ")"] };
}

export function COUNT(column: any) {
    return { column, wrappedBy: ["COUNT(", ")"] };
}

export function MIN(column: any): IWrappedColumn<any> {
    return { column, wrappedBy: ["MIN(", ")"] };
}

export function MAX(column: any): IWrappedColumn<any> {
    return { column, wrappedBy: ["MAX(", ")"] };
}

export function SUM(column: any): IWrappedColumn<any> {
    return { column, wrappedBy: ["SUM(", ")"] };
}

export function TOTAL(column: any): IWrappedColumn<any> {
    return { column, wrappedBy: ["TOTAL(", ")"] };
}

export function CF<T>(strings: TemplateStringsArray, column: any): IWrappedColumn<any> {
    return { column, wrappedBy: [strings[0], strings[1]] };
}
