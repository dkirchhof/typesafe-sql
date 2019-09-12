"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function avg(columnOrValue) {
    return `AVG(${columnOrValue})`;
}
exports.avg = avg;
function count(columnOrValue) {
    return `COUNT(${columnOrValue})`;
}
exports.count = count;
function max(columnOrValue) {
    return `MAX(${columnOrValue})`;
}
exports.max = max;
function min(columnOrValue) {
    return `MIN(${columnOrValue})`;
}
exports.min = min;
function sum(columnOrValue) {
    return `SUM(${columnOrValue})`;
}
exports.sum = sum;
