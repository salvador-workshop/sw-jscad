/**
 * Utilities
 * @memberof utils
 * @namespace extras
 */

/**
 * ...
 * @memberof utils.extras
 * @param {string} str 
 * @returns ...
 */
const camelCase = (str) => {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

/**
 * ...
 * @memberof utils.extras
 * @param {string} str 
 * @returns ...
 */
const constantToCamelCase = (str) => {
    return camelCase(str.replaceAll('_', ' ').toLowerCase())
}

module.exports = {
    camelCase,
    constantToCamelCase
}
