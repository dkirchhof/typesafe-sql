import { Column } from "./Column";
import { sanitizeValue } from "./utils";

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

export class Predicate<Type> {
    constructor(private readonly columnOrValue1: Column<Type> | Type, private readonly operator: Operator, private readonly columnOrValue2: Column<Type> | Type) {

    }

    public toString() {
        const converter1 = this.columnOrValue2 instanceof Column ? this.columnOrValue2.options.converter : null;
        const converter2 = this.columnOrValue1 instanceof Column ? this.columnOrValue1.options.converter : null;

        const convertedColumnOrValue1 = converter1 ? converter1.toDB(this.columnOrValue1) : this.columnOrValue1;
        const convertedColumnOrValue2 = converter2 ? converter2.toDB(this.columnOrValue2) : this.columnOrValue2;

        const sanitizedColumnOrValue1 = sanitizeValue(convertedColumnOrValue1);
        const sanitizedColumnOrValue2 = sanitizeValue(convertedColumnOrValue2);

        return `${sanitizedColumnOrValue1} ${this.operator} ${sanitizedColumnOrValue2}`;
    }
}

export type PredicateFactory<Columns> = (columns: Columns) => Predicate<any> | PredicateGroup;

export const equal = <Type>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "=", columnOrValue2);
export const notEqual = <Type>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "<>", columnOrValue2);

export const moreThan = <Type>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, ">", columnOrValue2);
export const moreThanOrEqual = <Type>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, ">=", columnOrValue2);
export const lessThan = <Type>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "<", columnOrValue2);
export const lessThanOrEqual = <Type>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "<=", columnOrValue2);

// export const iin = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "IN", columnOrValue2);
// export const nin = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "NOT IN", columnOrValue2);

// between

// any
// exists
// all
// some

export const isNull = <Type>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "IS", null);
export const isNotNull = <Type>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "IS NOT", null);

export const like = <Type>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "LIKE", columnOrValue2);
export const notLike = <Type>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "NOT LIKE", columnOrValue2);
