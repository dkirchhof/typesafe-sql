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
exports.equals = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "=", columnOrValue2);
exports.unequals = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "<>", columnOrValue2);
