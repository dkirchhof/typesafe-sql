import { Column } from "./Column";
import { Operator } from "./Operator";
import { sanitizeValue } from "./utils";

type ColumnOrValueType = string | number | null;

export class Predicate<Type extends ColumnOrValueType> {
    constructor(private readonly columnOrValue1: Column<Type> | Type, private readonly operator: Operator, private readonly columnOrValue2: Column<Type> | Type) {

    }

    public toString() {
        return `${sanitizeValue(this.columnOrValue1)} ${this.operator} ${sanitizeValue(this.columnOrValue2)}`;
    }
}

export const equals = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "=", columnOrValue2);
export const unequals = <Type extends ColumnOrValueType>(columnOrValue1: Column<Type> | Type, columnOrValue2: Column<Type> | Type) => new Predicate(columnOrValue1, "<>", columnOrValue2);
