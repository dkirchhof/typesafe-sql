"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notLike = exports.like = exports.isNotNull = exports.isNull = exports.notIn = exports.isIn = exports.lessThanOrEqual = exports.lessThan = exports.moreThanOrEqual = exports.moreThan = exports.notEqual = exports.equal = exports.InPredicate = exports.SingleValuePredicate = exports.Predicate = exports.or = exports.and = exports.PredicateGroup = void 0;
const Column_1 = require("./Column");
const utils_1 = require("./utils");
const select_1 = require("./queries/select");
class PredicateGroup {
    operator;
    operands;
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
                return columnOrValue.toString();
            }
            const convertedValue = converter ? converter.toDB(columnOrValue) : columnOrValue;
            const convertedAndSanitizedValue = utils_1.sanitizeValue(convertedValue);
            return convertedAndSanitizedValue;
        };
    }
}
exports.Predicate = Predicate;
class SingleValuePredicate extends Predicate {
    column;
    operator;
    columnOrValue;
    constructor(column, operator, columnOrValue) {
        super();
        this.column = column;
        this.operator = operator;
        this.columnOrValue = columnOrValue;
    }
    toString() {
        // if subquery
        if (this.columnOrValue instanceof select_1.ExecutableSelectQueryWithProjections) {
            return `${this.column} ${this.operator} (\n${this.columnOrValue.toSQL()}\n)`;
        }
        const convertAndSanitize = this.convertAndSanizizeColumnOrValue(this.column.options.converter);
        const convertedAndSanitizedColumnOrValue = convertAndSanitize(this.columnOrValue);
        return `${this.column} ${this.operator} ${convertedAndSanitizedColumnOrValue}`;
    }
}
exports.SingleValuePredicate = SingleValuePredicate;
class InPredicate extends Predicate {
    column;
    operator;
    columnsOrValues;
    constructor(column, operator, columnsOrValues) {
        super();
        this.column = column;
        this.operator = operator;
        this.columnsOrValues = columnsOrValues;
    }
    toString() {
        // if subquery
        if (this.columnsOrValues instanceof select_1.ExecutableSelectQueryWithProjections) {
            return `${this.column} ${this.operator} (\n${this.columnsOrValues.toSQL()}\n)`;
        }
        const convertAndSanitize = this.convertAndSanizizeColumnOrValue(this.column.options.converter);
        const convertedAndSanitizedColumnsOrValues = this.columnsOrValues.map(convertAndSanitize);
        return `${this.column} ${this.operator} (${convertedAndSanitizedColumnsOrValues.join(", ")})`;
    }
}
exports.InPredicate = InPredicate;
const equal = (column, columnOrValue) => new SingleValuePredicate(column, "=", columnOrValue);
exports.equal = equal;
const notEqual = (column, columnOrValue) => new SingleValuePredicate(column, "<>", columnOrValue);
exports.notEqual = notEqual;
const moreThan = (column, columnOrValue) => new SingleValuePredicate(column, ">", columnOrValue);
exports.moreThan = moreThan;
const moreThanOrEqual = (column, columnOrValue) => new SingleValuePredicate(column, ">=", columnOrValue);
exports.moreThanOrEqual = moreThanOrEqual;
const lessThan = (column, columnOrValue) => new SingleValuePredicate(column, "<", columnOrValue);
exports.lessThan = lessThan;
const lessThanOrEqual = (column, columnOrValue) => new SingleValuePredicate(column, "<=", columnOrValue);
exports.lessThanOrEqual = lessThanOrEqual;
const isIn = (column, values) => new InPredicate(column, "IN", values);
exports.isIn = isIn;
const notIn = (column, values) => new InPredicate(column, "NOT IN", values);
exports.notIn = notIn;
// between
// any
// exists
// all
// some
const isNull = (column) => new SingleValuePredicate(column, "IS", null);
exports.isNull = isNull;
const isNotNull = (column) => new SingleValuePredicate(column, "IS NOT", null);
exports.isNotNull = isNotNull;
const like = (column, columnOrValue) => new SingleValuePredicate(column, "LIKE", columnOrValue);
exports.like = like;
const notLike = (column, columnOrValue) => new SingleValuePredicate(column, "NOT LIKE", columnOrValue);
exports.notLike = notLike;
