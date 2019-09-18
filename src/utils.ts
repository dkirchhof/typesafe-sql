export function sanitizeValue(value: any): string {
    if (typeof value === "string") {
        return `'${value}'`;
    }

    if (value !== undefined && value !== null) {
        return value.toString();
    }

    return "null";
}

export function toArray<T>(value: T | T[]): T[] {
    if (Array.isArray(value)) {
        return value;
    } else {
        return [value];
    }
}
