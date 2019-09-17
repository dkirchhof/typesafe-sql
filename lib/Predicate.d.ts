import { Column } from "./Column";
declare type ColumnOrValueType = string | number | null;
declare type Operator = "=" | "<>" | ">" | ">=" | "<" | "<=" | "IS" | "IS NOT" | "LIKE" | "NOT LIKE";
declare type BooleanOperator = "AND" | "OR";
export declare class PredicateGroup {
    private readonly operator;
    private readonly operands;
    constructor(operator: BooleanOperator, ...operands: Array<Predicate<any>>);
    toString(): string;
}
export declare function and(...operands: Array<Predicate<any>>): PredicateGroup;
export declare function or(...operands: Array<Predicate<any>>): PredicateGroup;
export declare class Predicate<Type extends ColumnOrValueType> {
    private readonly columnOrValue1;
    private readonly operator;
    private readonly columnOrValue2;
    constructor(columnOrValue1: Column<Type> | Type, operator: Operator, columnOrValue2: Column<Type> | Type);
    toString(): string;
}
export declare type PredicateFactory<Columns> = (columns: Columns) => Predicate<any> | PredicateGroup;
export declare const equal: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const notEqual: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const moreThan: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const moreThanOrEqual: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const lessThan: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const lessThanOrEqual: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const isNull: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type | null>;
export declare const isNotNull: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type | null>;
export declare const like: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const notLike: <Type extends ColumnOrValueType>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export {};
