"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = exports.sanitizeValue = void 0;
function sanitizeValue(value) {
    if (typeof value === "string") {
        return `'${value}'`;
    }
    if (value !== undefined && value !== null) {
        return value.toString();
    }
    return "null";
}
exports.sanitizeValue = sanitizeValue;
function toArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    else {
        return [value];
    }
}
exports.toArray = toArray;
