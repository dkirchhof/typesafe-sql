import { Column } from "./Column";
import { sanitizeValue } from "./utils";

type ColumnOrValueType = string | number | null;
type Operator = "=" | "<>" | ">" | ">=" | "<" | "<=" | "IN" | "NOT IN" | "IS" | "IS NOT";

export class Predicate<Type extends ColumnOrValueType> {
    constructor(private readonly columnOrValue1: Column<Type> | Type, private readonly operator: Operator, private readonly columnOrValue2: Column<Type> | Type) {

    }

    public toString() {
        return `${sanitizeValue(this.columnOrValue1)} ${this.operator} ${sanitizeValue(this.columnOrValue2)}`;
    }
}

export type PredicateFactory<Columns> = (columns: Columns) => Predicate<any>;

export const eq = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "=", columnOrValue2);
export const ne = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "<>", columnOrValue2);

export const gt = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, ">", columnOrValue2);
export const gte = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, ">=", columnOrValue2);
export const lt = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "<", columnOrValue2);
export const lte = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "<=", columnOrValue2);

export const iin = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "IN", columnOrValue2);
export const nin = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "NOT IN", columnOrValue2);

export const is = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "IS", columnOrValue2);
export const isn = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "IS NOT", columnOrValue2);
