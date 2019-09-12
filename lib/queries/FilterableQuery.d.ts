import { IFilter } from "../Filter";
import { Operator } from "../Operator";
import { BaseQuery } from "./BaseQuery";
export declare abstract class FilterableQuery<Type> extends BaseQuery<Type> {
    protected filters: Array<IFilter<Type, keyof Type>>;
    where<Column extends keyof Type>(column: Column, operator: Operator, value: Type[Column] | Array<Type[Column]>): this;
    protected filtersToSQL(): string;
}
