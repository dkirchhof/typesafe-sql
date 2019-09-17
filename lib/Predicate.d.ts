import { Column } from "./Column";
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
export declare class Predicate<Type> {
    private readonly columnOrValue1;
    private readonly operator;
    private readonly columnOrValue2;
    constructor(columnOrValue1: Column<Type> | Type, operator: Operator, columnOrValue2: Column<Type> | Type);
    toString(): string;
}
export declare type PredicateFactory<Columns> = (columns: Columns) => Predicate<any> | PredicateGroup;
export declare const equal: <Type>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const notEqual: <Type>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const moreThan: <Type>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const moreThanOrEqual: <Type>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const lessThan: <Type>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const lessThanOrEqual: <Type>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const isNull: <Type>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type | null>;
export declare const isNotNull: <Type>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type | null>;
export declare const like: <Type>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export declare const notLike: <Type>(columnOrValue1: Type | Column<Type>, columnOrValue2: Type | Column<Type>) => Predicate<Type>;
export {};
