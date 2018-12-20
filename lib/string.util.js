module.exports = {

    /**
     * Splits a string on the first occurrence of the provided separator.
     * Returns an array with one or two elements.
     * @param {String} string
     * @param {String} separator
     */
    splitFirst: (string, separator) => {
        const separatorIndex = string.indexOf(separator);

        if (separatorIndex < 0) {
            return [string];
        }

        return [
            string.substring(0, separatorIndex),
            string.substring(separatorIndex + 1),
        ];
    },
};
