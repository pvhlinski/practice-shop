# Tests

- Every bug fix comes with a test that fails without the fix.
- Tests sit next to the code: `src/<name>.test.ts`, written with vitest.
- Check the numbers a customer would see: the order totals and the receipt text.
- `yarn test`, `yarn lint` and `yarn check-types` must all pass before a commit.
