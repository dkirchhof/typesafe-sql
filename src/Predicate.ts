import { Column } from "./Column";
import { IConverter } from "./Table";
import { sanitizeValue } from "./utils";
import { ExecutableSelectQuery } from "./queries/select";

type SingleValueOperator = "=" | "<>" | ">" | ">=" | "<" | "<=" | "IS" | "IS NOT" | "LIKE" | "NOT LIKE";
type MultiValueOperator = "IN" | "NOT IN";
type BooleanOperator = "AND" | "OR";

// type ColumnOrValue<Type> = Type | Column<Type> | ExecutableSelectQuery<{ [s: string]: Type; }> | null; 
type ColumnOrValue<Type> = Type | Column<Type> | ExecutableSelectQuery<{ value: Type; }> | null; 

export class PredicateGroup {
    private readonly operands: Predicate[];

    constructor(private readonly operator: BooleanOperator, ...operands: Predicate[]) {
        this.operands = operands;
    }

    public toString() {
        return `(${this.operands.join(` ${this.operator} `)})`;
    }
}

export function and(...predicates: Predicate[]) {
    return new PredicateGroup("AND", ...predicates);
}

export function or(...predicates: Predicate[]) {
    return new PredicateGroup("OR", ...predicates);
}

export abstract class Predicate {
    protected convertAndSanizizeColumnOrValue(converter: IConverter<any, any> | undefined) {
        return (columnOrValue: any) => {
            if (columnOrValue instanceof Column) {
                return columnOrValue;
            }

            if(columnOrValue instanceof ExecutableSelectQuery) {
                return `(${columnOrValue.toSQL()})`;
            }
            
            const convertedValue = converter ? converter.toDB(columnOrValue) : columnOrValue;
            const convertedAndSanitizedValue = sanitizeValue(convertedValue);
            
            return convertedAndSanitizedValue;
        };
    }
}

export class SingleValuePredicate<Type> extends Predicate {
    constructor(private readonly column: Column<Type>, private readonly operator: SingleValueOperator, private readonly columnOrValue: ColumnOrValue<Type>) { 
        super();
    }

    public toString() {
        const convertAndSanitize = this.convertAndSanizizeColumnOrValue(this.column.options.converter);
        const convertedAndSanitizedColumnOrValue = convertAndSanitize(this.columnOrValue);

        return `${this.column} ${this.operator} ${convertedAndSanitizedColumnOrValue}`;
    }
}

export class InPredicate<Type> extends Predicate {
    constructor(private readonly column: Column<Type>, private readonly operator: MultiValueOperator, private readonly columnsOrValues: Array<ColumnOrValue<Type>>) { 
        super();
    }

    public toString() {
        const convertAndSanitize = this.convertAndSanizizeColumnOrValue(this.column.options.converter);
        const convertedAndSanitizedColumnsOrValues = this.columnsOrValues.map(convertAndSanitize);

        return `${this.column} ${this.operator} (${convertedAndSanitizedColumnsOrValues.join(", ")})`;
    }
}

export type PredicateFactory<Columns> = (columns: Columns) => Predicate | PredicateGroup;

export const equal = <Type>(column: Column<Type>, columnOrValue: ColumnOrValue<Type>) => new SingleValuePredicate(column, "=", columnOrValue);
export const notEqual = <Type>(column: Column<Type>, columnOrValue: ColumnOrValue<Type>) => new SingleValuePredicate(column, "<>", columnOrValue);

export const moreThan = <Type>(column: Column<Type>, columnOrValue: ColumnOrValue<Type>) => new SingleValuePredicate(column, ">", columnOrValue);
export const moreThanOrEqual = <Type>(column: Column<Type>, columnOrValue: ColumnOrValue<Type>) => new SingleValuePredicate(column, ">=", columnOrValue);
export const lessThan = <Type>(column: Column<Type>, columnOrValue: ColumnOrValue<Type>) => new SingleValuePredicate(column, "<", columnOrValue);
export const lessThanOrEqual = <Type>(column: Column<Type>, columnOrValue: ColumnOrValue<Type>) => new SingleValuePredicate(column, "<=", columnOrValue);

export const isIn = <Type>(column: Column<Type>, values: Type[]) => new InPredicate(column, "IN", values);
export const notIn = <Type>(column: Column<Type>, values: Type[]) => new InPredicate(column, "NOT IN", values);

// between

// any
// exists
// all
// some

export const isNull = <Type>(column: Column<Type>) => new SingleValuePredicate(column, "IS", null);
export const isNotNull = <Type>(column: Column<Type>) => new SingleValuePredicate(column, "IS NOT", null);

export const like = <Type>(column: Column<Type>, columnOrValue: ColumnOrValue<Type>) => new SingleValuePredicate(column, "LIKE", columnOrValue);
export const notLike = <Type>(column: Column<Type>, columnOrValue: ColumnOrValue<Type>) => new SingleValuePredicate(column, "NOT LIKE", columnOrValue);
