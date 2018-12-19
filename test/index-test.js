const vows = require('vows');
const assert = require('assert');
const http = require('../lib');

vows.describe('main').addBatch({

    'module': {
        'should export BasicStrategy': () => {
            assert.isFunction(http.BasicStrategy);
        },

        'should export DigestStrategy': () => {
            assert.isFunction(http.DigestStrategy);
        },
    },

}).export(module);
