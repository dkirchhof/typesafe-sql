import { IExtendedColumnOptions, IWrappedColumn } from "./Table";
export declare function sanitizeValue(value: any): string | null;
export declare function convertValueToDB(column: IExtendedColumnOptions<any>, valueOrColumn: any): any;
export declare function convertValueToJS(column: IExtendedColumnOptions<any>, value: any): any;
export declare function isColumn(column: any): column is IExtendedColumnOptions<any>;
export declare function isWrappedColum(wrapper: any): wrapper is IWrappedColumn<any>;
