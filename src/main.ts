import { createShopServer } from "./server.ts";

const DEFAULT_PORT = 3000;
const port = Number(process.env.PORT ?? DEFAULT_PORT);
createShopServer().listen(port, () => console.log(`practice shop on http://localhost:${DEFAULT_PORT}`));
