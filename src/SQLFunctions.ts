import { IWrappedColumn } from ".";

export function AVG<T>(column: T): T {
    return { column, wrappedBy: ["AVG(", ")"] } as any;
}

export function COUNT<T>(column: T): T {
    return { column, wrappedBy: ["COUNT(", ")"] } as any;
}

export function MIN<T>(column: T): T {
    return { column, wrappedBy: ["MIN(", ")"] } as any;
}

export function MAX<T>(column: T): T {
    return { column, wrappedBy: ["MAX(", ")"] } as any;
}

export function SUM<T>(column: T): T {
    return { column, wrappedBy: ["SUM(", ")"] } as any;
}

export function TOTAL<T>(column: T): T {
    return { column, wrappedBy: ["TOTAL(", ")"] } as any;
}

export function CF<T>(strings: TemplateStringsArray, column: T): T {
    return { column, wrappedBy: [strings[0], strings[1]] } as any;
}
