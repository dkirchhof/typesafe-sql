import { Table } from "..";
import { Filter, ExtendedFilter } from "../Filter";
import { BaseQuery } from "./BaseQuery";
import { Operator } from "../Operator";

export abstract class FilterableQuery<Type> extends BaseQuery<Type>
{
    protected filters: Required<Filter<Type, keyof Type>>[] = [];
    
    where<Column extends keyof Type>(column: Column, value: Type[Column]): this;
    where<Column extends keyof Type>(filter: Filter<Type, Column>): this;
    where<Column extends keyof Type>(filterOrColumn: Filter<Type, Column> | Column, value?: Type[Column])
	{
        if(typeof filterOrColumn === "object")
        {
            this.filters.push({ operator: "=", ...filterOrColumn });
        }
        else
        {
            this.filters.push({ operator: "=", column: filterOrColumn, value: value! })
        }

		return this;
    }

    protected filtersToSQL()
    {
        if(!this.filters.length)
        {
            return "";
        }

        const filters = this.filters
            .map(filter => `${filter.column} ${filter.operator} ${filter.value}`)
            .join(" AND ");

        return `WHERE ${filters}`;
    }
}