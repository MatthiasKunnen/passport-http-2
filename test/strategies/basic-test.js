const vows = require('vows');
const assert = require('assert');
const BasicStrategy = require('passport-http/strategies/basic');

vows.describe('BasicStrategy').addBatch({
    'strategy': {
        topic: function () {
            return new BasicStrategy((() => {
            }));
        },

        'should be named basic': function (strategy) {
            assert.strictEqual(strategy.name, 'basic');
        },
    },

    'strategy handling a request': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(null, user);
                };
                strategy.fail = function () {
                    self.callback(new Error('should not be called'));
                };

                req.headers = {};
                req.headers.authorization = 'Basic Ym9iOnNlY3JldA==';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should not generate an error': function (err, user) {
                assert.isNull(err);
            },
            'should authenticate': function (err, user) {
                assert.strictEqual(user.username, 'bob');
                assert.strictEqual(user.password, 'secret');
            },
        },
    },

    'strategy handling a request that is not verified': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, false);
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(new Error('should not be called'));
                };
                strategy.fail = function (challenge) {
                    self.callback(null, challenge);
                };

                req.headers = {};
                req.headers.authorization = 'Basic Ym9iOnNlY3JldA==';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication with challenge': function (err, challenge) {
                // fail action was called, resulting in test callback
                assert.isNull(err);
                assert.strictEqual(challenge, 'Basic realm="Users"');
            },
        },
    },

    'strategy handling a request that encounters an error during verification': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(new Error('something went wrong'));
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(new Error('should not be called'));
                };
                strategy.fail = function (challenge) {
                    self.callback(new Error('should not be called'));
                };
                strategy.error = function (err) {
                    self.callback(null, err);
                };

                req.headers = {};
                req.headers.authorization = 'Basic Ym9iOnNlY3JldA==';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should not call success or fail': function (err, e) {
                assert.isNull(err);
            },
            'should call error': function (err, e) {
                assert.instanceOf(e, Error);
            },
        },
    },

    'strategy handling a request without authorization credentials': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(new Error('should not be called'));
                };
                strategy.fail = function (challenge) {
                    self.callback(null, challenge);
                };

                req.headers = {};
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication with challenge': function (err, challenge) {
                // fail action was called, resulting in test callback
                assert.isNull(err);
                assert.strictEqual(challenge, 'Basic realm="Users"');
            },
        },
    },

    'strategy handling a request with non-Basic authorization credentials': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(new Error('should not be called'));
                };
                strategy.fail = function (challenge) {
                    self.callback(null, challenge);
                };

                req.headers = {};
                req.headers.authorization = 'XXXXX Ym9iOnNlY3JldA==';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication with challenge': function (err, challenge) {
                // fail action was called, resulting in test callback
                assert.isNull(err);
                assert.strictEqual(challenge, 'Basic realm="Users"');
            },
        },
    },

    'strategy handling a request with credentials lacking a password': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(new Error('should not be called'));
                };
                strategy.fail = function (challenge) {
                    self.callback(null, challenge);
                };

                req.headers = {};
                req.headers.authorization = 'Basic Ym9iOg==';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication with challenge': function (err, challenge) {
                // fail action was called, resulting in test callback
                assert.isNull(err);
                assert.strictEqual(challenge, 'Basic realm="Users"');
            },
        },
    },

    'strategy handling a request with credentials lacking a username': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(new Error('should not be called'));
                };
                strategy.fail = function (challenge) {
                    self.callback(null, challenge);
                };

                req.headers = {};
                req.headers.authorization = 'Basic OnNlY3JldA==';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication with challenge': function (err, challenge) {
                // fail action was called, resulting in test callback
                assert.isNull(err);
                assert.strictEqual(challenge, 'Basic realm="Users"');
            },
        },
    },

    'strategy handling a request with malformed authorization header': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(new Error('should not be called'));
                };
                strategy.fail = function (status) {
                    self.callback(null, status);
                };

                req.headers = {};
                req.headers.authorization = 'Basic';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication with challenge': function (err, challenge) {
                // fail action was called, resulting in test callback
                assert.isNull(err);
                assert.strictEqual(challenge, 400);
            },
        },
    },

    'strategy handling a request with malformed authorization credentials': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(new Error('should not be called'));
                };
                strategy.fail = function (status) {
                    self.callback(null, status);
                };

                req.headers = {};
                req.headers.authorization = 'Basic *****';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication with challenge': function (err, challenge) {
                // fail action was called, resulting in test callback
                assert.isNull(err);
                assert.strictEqual(challenge, 400);
            },
        },
    },

    'strategy handling a request with BASIC scheme in capitalized letters': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(null, user);
                };
                strategy.fail = function () {
                    self.callback(new Error('should not be called'));
                };

                req.headers = {};
                req.headers.authorization = 'BASIC Ym9iOnNlY3JldA==';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should not generate an error': function (err, user) {
                assert.isNull(err);
            },
            'should authenticate': function (err, user) {
                assert.strictEqual(user.username, 'bob');
                assert.strictEqual(user.password, 'secret');
            },
        },
    },

    'strategy handling a request that is not verified against specific realm': {
        topic: function () {
            return new BasicStrategy({realm: 'Administrators'}, ((userid, password, done) => {
                done(null, false);
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(new Error('should not be called'));
                };
                strategy.fail = function (challenge) {
                    self.callback(null, challenge);
                };

                req.headers = {};
                req.headers.authorization = 'Basic Ym9iOnNlY3JldA==';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should fail authentication with challenge': (err, challenge) => {
                // fail action was called, resulting in test callback
                assert.isNull(err);
                assert.strictEqual(challenge, 'Basic realm="Administrators"');
            },
        },
    },

    'strategy constructed without a verify callback': {
        'should throw an error': function (strategy) {
            assert.throws(() => {
                new BasicStrategy();
            });
        },
    },

    'strategy with passReqToCallback=true option': {
        topic: function () {
            return new BasicStrategy({passReqToCallback: true}, (req, userid, password, done) => {
                assert.isNotNull(req);
                done(null, {username: userid, password: password});
            });
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const self = this;
                const req = {};
                strategy.success = function (user) {
                    self.callback(null, user);
                };
                strategy.fail = function () {
                    self.callback(new Error('should not be called'));
                };

                req.headers = {};
                req.headers.authorization = 'Basic Ym9iOnNlY3JldA==';
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should not generate an error': function (err, user) {
                assert.isNull(err);
            },
            'should authenticate': function (err, user) {
                assert.strictEqual(user.username, 'bob');
                assert.strictEqual(user.password, 'secret');
            },
        },
    },
}).export(module);
