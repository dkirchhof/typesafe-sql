"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.group = (columnOrValue) => `${utils_1.sanitizeValue(columnOrValue)}`;
