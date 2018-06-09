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
function SUM(column) {
    return { column, wrappedBy: ["SUM(", ")"] };
}
exports.SUM = SUM;
function TOTAL(column) {
    return { column, wrappedBy: ["TOTAL(", ")"] };
}
exports.TOTAL = TOTAL;
function CF(strings, column) {
    return { column, wrappedBy: [strings[0], strings[1]] };
}
exports.CF = CF;
