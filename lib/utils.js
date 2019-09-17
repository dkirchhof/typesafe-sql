"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
