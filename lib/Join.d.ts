import { Predicate, PredicateGroup } from "./Predicate";
import { AliasedSource } from "./Source";
export declare type InnerJoinMode = "CROSS" | "INNER";
export declare type OuterJoinMode = "LEFT OUTER";
export declare class Join {
    private joinMode;
    readonly source: AliasedSource;
    private predicate;
    constructor(joinMode: InnerJoinMode | OuterJoinMode, source: AliasedSource, predicate: Predicate | PredicateGroup | null);
    toString(): string;
}
