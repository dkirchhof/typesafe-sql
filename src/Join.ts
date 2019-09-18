import { Predicate, PredicateGroup } from "./Predicate";
import { AliasedSource } from "./Source";

export type JoinMode = "CROSS" | "INNER" | "LEFT OUTER";

export class Join {
    constructor(private joinMode: JoinMode, private readonly source: AliasedSource, private predicate: Predicate<any> | PredicateGroup | null) { }

    public toString() {
        const predicateString = this.predicate ? ` ON ${this.predicate}` : ``;

        return `${this.joinMode} JOIN ${this.source}${predicateString}`;
    }
}
