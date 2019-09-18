import { Column } from "./Column";
import { IConverter } from "./Table";
declare type SingleValueOperator = "=" | "<>" | ">" | ">=" | "<" | "<=" | "IS" | "IS NOT" | "LIKE" | "NOT LIKE";
declare type MultiValueOperator = "IN" | "NOT IN";
declare type BooleanOperator = "AND" | "OR";
export declare class PredicateGroup {
    private readonly operator;
    private readonly operands;
    constructor(operator: BooleanOperator, ...operands: Predicate[]);
    toString(): string;
}
export declare function and(...predicates: Predicate[]): PredicateGroup;
export declare function or(...predicates: Predicate[]): PredicateGroup;
export declare abstract class Predicate {
    protected convertAndSanizizeColumnOrValue(converter: IConverter<any, any> | undefined): (columnOrValue: any) => string | Column<any>;
}
export declare class SingleValuePredicate<Type> extends Predicate {
    private readonly column;
    private readonly operator;
    private readonly columnOrValue;
    constructor(column: Column<Type>, operator: SingleValueOperator, columnOrValue: Column<Type> | Type);
    toString(): string;
}
export declare class InPredicate<Type> extends Predicate {
    private readonly column;
    private readonly operator;
    private readonly columnsOrValues;
    constructor(column: Column<Type>, operator: MultiValueOperator, columnsOrValues: Array<Column<Type> | Type>);
    toString(): string;
}
export declare type PredicateFactory<Columns> = (columns: Columns) => Predicate | PredicateGroup;
export declare const equal: <Type>(column: Column<Type>, columnOrValue: Type | Column<Type>) => SingleValuePredicate<Type>;
export declare const notEqual: <Type>(column: Column<Type>, columnOrValue: Type | Column<Type>) => SingleValuePredicate<Type>;
export declare const moreThan: <Type>(column: Column<Type>, columnOrValue: Type | Column<Type>) => SingleValuePredicate<Type>;
export declare const moreThanOrEqual: <Type>(column: Column<Type>, columnOrValue: Type | Column<Type>) => SingleValuePredicate<Type>;
export declare const lessThan: <Type>(column: Column<Type>, columnOrValue: Type | Column<Type>) => SingleValuePredicate<Type>;
export declare const lessThanOrEqual: <Type>(column: Column<Type>, columnOrValue: Type | Column<Type>) => SingleValuePredicate<Type>;
export declare const isIn: <Type>(column: Column<Type>, values: Type[]) => InPredicate<Type>;
export declare const notIn: <Type>(column: Column<Type>, values: Type[]) => InPredicate<Type>;
export declare const isNull: <Type>(column: Column<Type>) => SingleValuePredicate<Type | null>;
export declare const isNotNull: <Type>(column: Column<Type>) => SingleValuePredicate<Type | null>;
export declare const like: <Type>(column: Column<Type>, columnOrValue: Type | Column<Type>) => SingleValuePredicate<Type>;
export declare const notLike: <Type>(column: Column<Type>, columnOrValue: Type | Column<Type>) => SingleValuePredicate<Type>;
export {};
