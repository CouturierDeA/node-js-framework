import { normalize } from "node:path";

export function sanitizePath(unsafePath: unknown) {
    if (typeof unsafePath !== "string") throw new Error("path must be a string");
    // Normalize the path to handle '.' and '..'
    const normalizedPath = normalize(unsafePath);
    return normalizedPath.replace(/^(\.\.(\/|\\|$))+/, '');
}
