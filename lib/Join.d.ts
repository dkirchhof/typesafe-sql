import { Predicate } from "./Predicate";
import { AliasedSource } from "./Source";
export declare type JoinMode = "CROSS" | "INNER" | "LEFT OUTER";
export declare class Join {
    private joinMode;
    private readonly source;
    private predicate;
    constructor(joinMode: JoinMode, source: AliasedSource, predicate: Predicate<any>);
    toString(): string;
}
