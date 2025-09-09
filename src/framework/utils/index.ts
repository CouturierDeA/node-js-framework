const path = require('path');

export function sanitizePath(unsafePath: unknown) {
    // Normalize the path to handle '.' and '..'
    const normalizedPath = path.normalize(unsafePath);
    return normalizedPath.replace(/^(\.\.(\/|\\|$))+/, '');
}
