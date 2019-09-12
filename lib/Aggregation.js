"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function avg(column) {
    return `AVG(${column})`;
}
exports.avg = avg;
function count(column) {
    return `COUNT(${column})`;
}
exports.count = count;
function max(column) {
    return `MAX(${column})`;
}
exports.max = max;
function min(column) {
    return `MIN(${column})`;
}
exports.min = min;
function sum(column) {
    return `SUM(${column})`;
}
exports.sum = sum;
