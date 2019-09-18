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
function and(...predicates) {
    return new PredicateGroup("AND", ...predicates);
}
exports.and = and;
function or(...predicates) {
    return new PredicateGroup("OR", ...predicates);
}
exports.or = or;
class Predicate {
    convertAndSanizizeColumnOrValue(converter) {
        return (columnOrValue) => {
            if (columnOrValue instanceof Column_1.Column) {
                return columnOrValue;
            }
            const convertedValue = converter ? converter.toDB(columnOrValue) : columnOrValue;
            const convertedAndSanitizedValue = utils_1.sanitizeValue(convertedValue);
            return convertedAndSanitizedValue;
        };
    }
}
exports.Predicate = Predicate;
class SingleValuePredicate extends Predicate {
    constructor(column, operator, columnOrValue) {
        super();
        this.column = column;
        this.operator = operator;
        this.columnOrValue = columnOrValue;
    }
    toString() {
        const convertAndSanitize = this.convertAndSanizizeColumnOrValue(this.column.options.converter);
        const convertedAndSanitizedColumnOrValue = convertAndSanitize(this.columnOrValue);
        return `${this.column} ${this.operator} ${convertedAndSanitizedColumnOrValue}`;
    }
}
exports.SingleValuePredicate = SingleValuePredicate;
class InPredicate extends Predicate {
    constructor(column, operator, columnsOrValues) {
        super();
        this.column = column;
        this.operator = operator;
        this.columnsOrValues = columnsOrValues;
    }
    toString() {
        const convertAndSanitize = this.convertAndSanizizeColumnOrValue(this.column.options.converter);
        const convertedAndSanitizedColumnsOrValues = this.columnsOrValues.map(convertAndSanitize);
        return `${this.column} ${this.operator} (${convertedAndSanitizedColumnsOrValues.join(", ")})`;
    }
}
exports.InPredicate = InPredicate;
exports.equal = (column, columnOrValue) => new SingleValuePredicate(column, "=", columnOrValue);
exports.notEqual = (column, columnOrValue) => new SingleValuePredicate(column, "<>", columnOrValue);
exports.moreThan = (column, columnOrValue) => new SingleValuePredicate(column, ">", columnOrValue);
exports.moreThanOrEqual = (column, columnOrValue) => new SingleValuePredicate(column, ">=", columnOrValue);
exports.lessThan = (column, columnOrValue) => new SingleValuePredicate(column, "<", columnOrValue);
exports.lessThanOrEqual = (column, columnOrValue) => new SingleValuePredicate(column, "<=", columnOrValue);
exports.isIn = (column, values) => new InPredicate(column, "IN", values);
exports.notIn = (column, values) => new InPredicate(column, "NOT IN", values);
// between
// any
// exists
// all
// some
exports.isNull = (column) => new SingleValuePredicate(column, "IS", null);
exports.isNotNull = (column) => new SingleValuePredicate(column, "IS NOT", null);
exports.like = (column, columnOrValue) => new SingleValuePredicate(column, "LIKE", columnOrValue);
exports.notLike = (column, columnOrValue) => new SingleValuePredicate(column, "NOT LIKE", columnOrValue);
