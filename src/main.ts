import { createShopServer } from "./server.ts";

const port = Number(process.env.PORT ?? 3000);
createShopServer().listen(port, () => console.log(`practice shop on http://localhost:${port}`));
