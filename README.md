# Practice Shop

A small order calculator with an HTTP API, made to practise automated bug fixing. It is not a real shop.

## Rules of the shop

- All amounts are in euro and kept as integer cents.
- Catalog prices are without VAT.
- Coupons: SAVE10 takes 10% off everything, BOOKS20 takes 20% off books, FIVEOFF takes 5.00 off an order of 30.00 or more. One coupon per order. Codes are not case-sensitive.
- Shipping: DE 4.99, FR 5.99, PL 6.99. Orders of 50.00 or more after the discount ship for free.
- VAT: DE 19%, FR 20%, PL 23%. It is charged on the goods after the discount. Shipping is not taxed.
- Total = goods after the discount + shipping + VAT.

## API

`yarn start` runs it on port 3000 (`PORT` changes it).

- `GET /health` answers `{"ok":true}`.
- `POST /quote` with `{"items":[{"id":"mug","quantity":2}],"country":"DE","coupon":"SAVE10"}` answers the order and a text receipt. Product ids: mug, kettle, novel, atlas, gloves.

## Checks

`yarn test`, `yarn lint` and `yarn check-types` must all pass.
