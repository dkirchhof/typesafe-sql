"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AVG(column) {
    return { column, wrappedBy: ["AVG(", ")"] };
}
exports.AVG = AVG;
function COUNT(column) {
    return { column, wrappedBy: ["COUNT(", ")"] };
}
exports.COUNT = COUNT;
function MIN(column) {
    return { column, wrappedBy: ["MIN(", ")"] };
}
exports.MIN = MIN;
function MAX(column) {
    return { column, wrappedBy: ["MAX(", ")"] };
}
exports.MAX = MAX;
function max(columnOrValue) {
    return `MAX(${columnOrValue})`;
}
exports.max = max;
function SUM(column) {
    return { column, wrappedBy: ["SUM(", ")"] };
}
exports.SUM = SUM;
function TOTAL(column) {
    return { column, wrappedBy: ["TOTAL(", ")"] };
}
exports.TOTAL = TOTAL;
// export function CF<T>(strings: TemplateStringsArray, column: T): T {
//     return { column, wrappedBy: [strings[0], strings[1]] } as any;
// }
function CF(strings, column) {
    return `${strings[0]}column${strings[1]}`;
}
exports.CF = CF;
