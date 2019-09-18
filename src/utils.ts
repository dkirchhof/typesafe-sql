export function sanitizeValue(value: any): string {
    if (typeof value === "string") {
        return `'${value}'`;
    }

    if (value !== undefined && value !== null) {
        return value.toString();
    }

    return "null";
}
