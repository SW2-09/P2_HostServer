//
/**
 * Sanitizes a string by removing potential dangerous/undesired characters.
 * removed are: &, <, >, ", ', `, and /.
 * @param {string} str - The string to sanitize.
 * @returns {string} The sanitized string.
 */
export function sanitize(str) {
    return str
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .trim();
}
