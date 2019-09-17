import { Predicate, PredicateGroup } from "./Predicate";
import { AliasedSource } from "./Source";

export type JoinMode = "CROSS" | "INNER" | "LEFT OUTER";

export class Join {
    constructor(private joinMode: JoinMode, private readonly source: AliasedSource, private predicate: Predicate<any> | PredicateGroup) { }

    public toString() {
        return `${this.joinMode} JOIN ${this.source} ON ${this.predicate}`;
    }
}
