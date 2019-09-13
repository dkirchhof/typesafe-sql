import { Column } from "./Column";
declare type ColumnOrValueType = string | number | null;
declare type Operator = "=" | "<>" | ">" | ">=" | "<" | "<=" | "IN" | "NOT IN" | "IS" | "IS NOT";
export declare class Predicate<Type extends ColumnOrValueType> {
    private readonly columnOrValue1;
    private readonly operator;
    private readonly columnOrValue2;
    constructor(columnOrValue1: Column<Type> | Type, operator: Operator, columnOrValue2: Column<Type> | Type);
    toString(): string;
}
export declare type PredicateFactory<Columns> = (columns: Columns) => Predicate<any>;
export declare const eq: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const ne: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const gt: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const gte: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const lt: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const lte: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const iin: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const nin: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const is: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const isn: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export {};
