import { Operator } from "./Operator";
import { IExtendedColumnOptions } from ".";

export type Filter<Type, Column extends keyof Type> = { column: Column; value: Type[Column], operator?: Operator };
export type ExtendedFilter<Type> = { column: IExtendedColumnOptions<Type>; value: Type[keyof Type], operator?: Operator };