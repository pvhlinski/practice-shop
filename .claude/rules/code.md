# Code

- Money is integer cents everywhere; only `formatMoney` turns it into text.
- A rule of the shop lives in one place: README.md says what it is, one function in `src/` implements it.
- Keep functions small and pure; only `src/server.ts` and `src/main.ts` deal with HTTP and the process.
- Relative imports end in `.ts`.
