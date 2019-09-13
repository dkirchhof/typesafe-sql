"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Predicate {
    constructor(columnOrValue1, operator, columnOrValue2) {
        this.columnOrValue1 = columnOrValue1;
        this.operator = operator;
        this.columnOrValue2 = columnOrValue2;
    }
    toString() {
        return `${utils_1.sanitizeValue(this.columnOrValue1)} ${this.operator} ${utils_1.sanitizeValue(this.columnOrValue2)}`;
    }
}
exports.Predicate = Predicate;
exports.eq = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "=", columnOrValue2);
exports.ne = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "<>", columnOrValue2);
exports.gt = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, ">", columnOrValue2);
exports.gte = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, ">=", columnOrValue2);
exports.lt = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "<", columnOrValue2);
exports.lte = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "<=", columnOrValue2);
exports.iin = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "IN", columnOrValue2);
exports.nin = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "NOT IN", columnOrValue2);
exports.is = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "IS", columnOrValue2);
exports.isn = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "IS NOT", columnOrValue2);
