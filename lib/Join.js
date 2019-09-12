"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Join {
    constructor(joinMode, source, predicate) {
        this.joinMode = joinMode;
        this.source = source;
        this.predicate = predicate;
    }
    toString() {
        return `${this.joinMode} JOIN ${this.source} ON ${this.predicate}`;
    }
}
exports.Join = Join;
