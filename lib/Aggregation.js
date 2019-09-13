"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Column_1 = require("./Column");
function avg(column) {
    return new Column_1.Column(`AVG(${column})`);
}
exports.avg = avg;
function count(column) {
    return new Column_1.Column(`COUNT(${column})`);
}
exports.count = count;
function max(column) {
    return new Column_1.Column(`MAX(${column})`);
}
exports.max = max;
function min(column) {
    return new Column_1.Column(`MIN(${column})`);
}
exports.min = min;
function sum(column) {
    return new Column_1.Column(`SUM(${column})`);
}
exports.sum = sum;
