"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.asc = (columnOrValue) => `${utils_1.sanitizeValue(columnOrValue)} ASC`;
exports.desc = (columnOrValue) => `${utils_1.sanitizeValue(columnOrValue)} DESC`;
