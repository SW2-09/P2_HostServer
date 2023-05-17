//
/**
 * Sanitizes a string by removing potential dangerous/undesired characters.
 * removed are: &, <, >, ", ', `, and /.
 * @param {string} str - The string to sanitize.
 * @returns {string} The sanitized string.
 */
export function sanitize(str) {
    str = str
        .replace(/&/g, "")
        .replace(/</g, "")
        .replace(/>/g, "")
        .replace(/"/g, "")
        .replace(/'/g, "")
        .replace(/`/g, "")
        .replace(/\//g, "");
    return str.trim();
}
