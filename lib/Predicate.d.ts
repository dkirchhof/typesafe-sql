import { Column } from "./Column";
import { Operator } from "./Operator";
declare type ColumnOrValueType = string | number | null;
export declare class Predicate<Type extends ColumnOrValueType> {
    private readonly columnOrValue1;
    private readonly operator;
    private readonly columnOrValue2;
    constructor(columnOrValue1: Column<Type> | Type, operator: Operator, columnOrValue2: Column<Type> | Type);
    toString(): string;
}
export declare const equals: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const unequals: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export {};
