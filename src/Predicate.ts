import { Column } from "./Column";
import { sanitizeValue } from "./utils";

type ColumnOrValueType = string | number | null;
type Operator = "=" | "<>" | ">" | ">=" | "<" | "<=" | "IS" | "IS NOT" | "LIKE" | "NOT LIKE";
type BooleanOperator = "AND" | "OR";

export class PredicateGroup {
    private readonly operands: Array<Predicate<any>>;

    constructor(private readonly operator: BooleanOperator, ...operands: Array<Predicate<any>>) {
        this.operands = operands;
    }

    public toString() {
        return `(${this.operands.join(` ${this.operator} `)})`;
    }
}

export function and(...operands: Array<Predicate<any>>) {
    return new PredicateGroup("AND", ...operands);
}

export function or(...operands: Array<Predicate<any>>) {
    return new PredicateGroup("OR", ...operands);
}

export class Predicate<Type extends ColumnOrValueType> {
    constructor(private readonly columnOrValue1: Column<Type> | Type, private readonly operator: Operator, private readonly columnOrValue2: Column<Type> | Type) {

    }

    public toString() {
        return `${sanitizeValue(this.columnOrValue1)} ${this.operator} ${sanitizeValue(this.columnOrValue2)}`;
    }
}

export type PredicateFactory<Columns> = (columns: Columns) => Predicate<any> | PredicateGroup;

export const equal = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "=", columnOrValue2);
export const notEqual = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "<>", columnOrValue2);

export const moreThan = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, ">", columnOrValue2);
export const moreThanOrEqual = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, ">=", columnOrValue2);
export const lessThan = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "<", columnOrValue2);
export const lessThanOrEqual = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "<=", columnOrValue2);

// export const iin = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "IN", columnOrValue2);
// export const nin = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "NOT IN", columnOrValue2);

// between

// any
// exists
// all
// some

export const isNull = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "IS", null);
export const isNotNull = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "IS NOT", null);

export const like = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "LIKE", columnOrValue2);
export const notLike = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "NOT LIKE", columnOrValue2);
