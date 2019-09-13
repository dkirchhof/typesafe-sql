export function sanitizeValue(value: any): string | null {
    if (typeof value === "string") {
        return `"${value}"`;
    }

    if (value !== undefined && value !== null) {
        return value.toString();
    }

    return "null";
}
