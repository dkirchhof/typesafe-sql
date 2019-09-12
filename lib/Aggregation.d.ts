import { Column } from "./Column";
export declare function avg<T extends Column<any>>(column: T): T;
export declare function count<T extends Column<any>>(column: T): T;
export declare function max<T extends Column<any>>(column: T): T;
export declare function min<T extends Column<any>>(column: T): T;
export declare function sum<T extends Column<any>>(column: T): T;
