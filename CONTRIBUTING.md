## Contributing

### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases with complete code coverage.  Patches
that increase test coverage are happily accepted.

Ensure that the test suite passes by executing:

```bash
npm run test
```

Also make sure that your changes are in compliance with the code style of this
project by running:

```bash
npm run lint
```

Some linter errors can be fixed by running:

```bash
npm run lint -- --fix
```

Coverage reports can be generated and viewed by executing:

```bash
$ make test-cov
$ make view-cov
```
