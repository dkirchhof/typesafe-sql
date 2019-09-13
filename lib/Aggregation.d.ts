import { Column } from "./Column";
export declare function avg<T>(column: T): Column<T>;
export declare function count<T>(column: Column<T>): Column<T>;
export declare function max<T>(column: T): Column<T>;
export declare function min<T>(column: T): Column<T>;
export declare function sum<T>(column: T): Column<T>;
