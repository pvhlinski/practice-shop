# Practice Shop

A small TypeScript project: an order calculator with an HTTP API. The business rules are in README.md; when the code and README.md disagree, README.md is right.

## Layout

- src/money.ts: amounts in integer cents, formatting, percents
- src/catalog.ts, src/cart.ts: products and the cart
- src/discounts.ts: coupons
- src/shipping.ts, src/tax.ts: shipping cost and VAT by country
- src/order.ts: the order totals
- src/receipt.ts: the text receipt
- src/server.ts, src/main.ts: the HTTP API

## Commands

- `yarn test`: unit tests (vitest), including the API on a random local port
- `yarn lint`: eslint
- `yarn check-types`: tsc

All three must pass before a commit.

## Conventions

- Money is integer cents; never use floats for amounts.
- A bug fix comes with a test that fails without the fix.
- Tests sit next to the code: src/<name>.test.ts.
- Relative imports end in .ts.
- Commit messages: "<KEY>: <what changed>", one line.
