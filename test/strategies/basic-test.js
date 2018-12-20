const vows = require('vows');
const assert = require('assert');
const BasicStrategy = require('../../lib/strategies/basic');

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
                const req = {};
                strategy.success = (user) => {
                    this.callback(null, user);
                };
                strategy.fail = () => {
                    this.callback(new Error('should not be called'));
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
                const req = {};
                strategy.success = (user) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.fail = (challenge) => {
                    this.callback(null, challenge);
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
                const req = {};
                strategy.success = (user) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.fail = (challenge) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.error = (err) => {
                    this.callback(null, err);
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
                const req = {};
                strategy.success = (user) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.fail = (challenge) => {
                    this.callback(null, challenge);
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
                const req = {};
                strategy.success = (user) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.fail = (challenge) => {
                    this.callback(null, challenge);
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

    'strategy handling a request with credentials lacking the " " separator': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const req = {};
                strategy.success = (user) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.fail = (challenge) => {
                    this.callback(null, challenge);
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

    'strategy handling a request with credentials containing an empty user-pass': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const req = {};
                strategy.success = (user) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.fail = (challenge) => {
                    this.callback(null, challenge);
                };

                req.headers = {};
                req.headers.authorization = 'Basic ';
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

    'strategy handling a request with credentials lacking the ":" separator': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const req = {};
                strategy.success = (user) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.fail = (challenge) => {
                    this.callback(null, challenge);
                };

                req.headers = {};
                req.headers.authorization = 'Basic Ym9i'; // bob
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

    'strategy handling a request with credentials containing an empty username': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const req = {};
                strategy.success = (user) => {
                    this.callback(null, user);
                };
                strategy.fail = (challenge) => {
                    this.callback(new Error('should not be called'));
                };

                req.headers = {};
                req.headers.authorization = 'Basic OnBhc3N3b3Jk'; // :password
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should not generate an error': (err, user) => {
                assert.isNull(err);
            },
            'should authenticate': (err, user) => {
                assert.strictEqual(user.username, '');
                assert.strictEqual(user.password, 'password');
            },
        },
    },

    'strategy handling a request with credentials containing an empty password': {
        topic: function () {
            return new BasicStrategy(((userid, password, done) => {
                done(null, {username: userid, password: password});
            }));
        },

        'after augmenting with actions': {
            topic: function (strategy) {
                const req = {};
                strategy.success = (user) => {
                    this.callback(null, user);
                };
                strategy.fail = (challenge) => {
                    this.callback(new Error('should not be called'));
                };

                req.headers = {};
                req.headers.authorization = 'Basic Ym9iOg=='; // bob:
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },

            'should not generate an error': (err, user) => {
                assert.isNull(err);
            },
            'should authenticate': (err, user) => {
                assert.strictEqual(user.username, 'bob');
                assert.strictEqual(user.password, '');
            },
        },
    },

    'strategy handling a request containing a colon in the password': {
        topic: function () {
            return new BasicStrategy((userid, password, done) => {
                done(null, {username: userid, password: password});
            });
        },
        'after augmenting with actions': {
            topic: function (strategy) {
                const req = {};
                strategy.success = user => {
                    this.callback(null, user);
                };
                strategy.fail = () => {
                    this.callback(new Error('should not be called'));
                };

                req.headers = {};
                req.headers.authorization = 'Basic Ym9iOnNlY3JldDpwdw=='; // bob:secret:pw
                process.nextTick(() => {
                    strategy.authenticate(req);
                });
            },
            'should not generate an error': (err, user) => {
                assert.isNull(err);
            },
            'should authenticate': (err, user) => {
                assert.strictEqual(user.username, 'bob');
                assert.strictEqual(user.password, 'secret:pw');
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
                const req = {};
                strategy.success = (user) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.fail = (status) => {
                    this.callback(null, status);
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
                const req = {};
                strategy.success = (user) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.fail = (status) => {
                    this.callback(null, status);
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
                const req = {};
                strategy.success = (user) => {
                    this.callback(null, user);
                };
                strategy.fail = () => {
                    this.callback(new Error('should not be called'));
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
                const req = {};
                strategy.success = (user) => {
                    this.callback(new Error('should not be called'));
                };
                strategy.fail = (challenge) => {
                    this.callback(null, challenge);
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
                const req = {};
                strategy.success = (user) => {
                    this.callback(null, user);
                };
                strategy.fail = () => {
                    this.callback(new Error('should not be called'));
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
