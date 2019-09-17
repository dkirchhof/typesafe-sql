"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Column_1 = require("./Column");
const utils_1 = require("./utils");
class PredicateGroup {
    constructor(operator, ...operands) {
        this.operator = operator;
        this.operands = operands;
    }
    toString() {
        return `(${this.operands.join(` ${this.operator} `)})`;
    }
}
exports.PredicateGroup = PredicateGroup;
function and(...operands) {
    return new PredicateGroup("AND", ...operands);
}
exports.and = and;
function or(...operands) {
    return new PredicateGroup("OR", ...operands);
}
exports.or = or;
class Predicate {
    constructor(columnOrValue1, operator, columnOrValue2) {
        this.columnOrValue1 = columnOrValue1;
        this.operator = operator;
        this.columnOrValue2 = columnOrValue2;
    }
    toString() {
        const converter1 = this.columnOrValue2 instanceof Column_1.Column ? this.columnOrValue2.options.converter : null;
        const converter2 = this.columnOrValue1 instanceof Column_1.Column ? this.columnOrValue1.options.converter : null;
        const convertedColumnOrValue1 = converter1 ? converter1.toDB(this.columnOrValue1) : this.columnOrValue1;
        const convertedColumnOrValue2 = converter2 ? converter2.toDB(this.columnOrValue2) : this.columnOrValue2;
        const sanitizedColumnOrValue1 = utils_1.sanitizeValue(convertedColumnOrValue1);
        const sanitizedColumnOrValue2 = utils_1.sanitizeValue(convertedColumnOrValue2);
        return `${sanitizedColumnOrValue1} ${this.operator} ${sanitizedColumnOrValue2}`;
    }
}
exports.Predicate = Predicate;
exports.equal = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "=", columnOrValue2);
exports.notEqual = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "<>", columnOrValue2);
exports.moreThan = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, ">", columnOrValue2);
exports.moreThanOrEqual = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, ">=", columnOrValue2);
exports.lessThan = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "<", columnOrValue2);
exports.lessThanOrEqual = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "<=", columnOrValue2);
// export const iin = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "IN", columnOrValue2);
// export const nin = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "NOT IN", columnOrValue2);
// between
// any
// exists
// all
// some
exports.isNull = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "IS", null);
exports.isNotNull = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "IS NOT", null);
exports.like = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "LIKE", columnOrValue2);
exports.notLike = (columnOrValue1, columnOrValue2) => new Predicate(columnOrValue1, "NOT LIKE", columnOrValue2);
