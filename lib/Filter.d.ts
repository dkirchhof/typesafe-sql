import { Operator } from "./Operator";
export interface IFilter<Type, Column extends keyof Type> {
    column: Column;
    value: Type[Column] | Array<Type[Column]>;
    operator: Operator;
}
