import { Predicate, PredicateGroup } from "./Predicate";
import { AliasedSource } from "./Source";

export type InnerJoinMode = "CROSS" | "INNER";
export type OuterJoinMode = "LEFT OUTER";

export class Join {
    constructor(private joinMode: InnerJoinMode | OuterJoinMode, private readonly source: AliasedSource, private predicate: Predicate | PredicateGroup | null) { }

    public toString() {
        const predicateString = this.predicate ? ` ON ${this.predicate}` : ``;

        return `${this.joinMode} JOIN ${this.source}${predicateString}`;
    }
}
