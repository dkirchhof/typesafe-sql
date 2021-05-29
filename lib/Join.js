"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Join = void 0;
class Join {
    joinMode;
    source;
    predicate;
    constructor(joinMode, source, predicate) {
        this.joinMode = joinMode;
        this.source = source;
        this.predicate = predicate;
    }
    toString() {
        const predicateString = this.predicate ? ` ON ${this.predicate}` : ``;
        return `${this.joinMode} JOIN ${this.source}${predicateString}`;
    }
}
exports.Join = Join;
