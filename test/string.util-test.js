const vows = require('vows');
const assert = require('assert');
const stringUtils = require('../lib/string.util');
const {splitFirst} = stringUtils;

vows.describe('string utils').addBatch({

    'module': {
        'should export splitFirst': () => {
            assert.isFunction(stringUtils.splitFirst);
        },
    },

    'splitFirst': {
        'should split only first': () => {
            assert.deepStrictEqual(splitFirst('bob:secret:pw', ':'), ['bob', 'secret:pw']);
            assert.deepStrictEqual(splitFirst('a:bb:a:d', ':'), ['a', 'bb:a:d']);
        },
        'should handle non-existing seperator': () => {
            assert.deepStrictEqual(splitFirst('abc', ':'), ['abc']);
        },
    },

}).export(module);
