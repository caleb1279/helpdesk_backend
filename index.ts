import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./routes/index.routes.ts";
import { loadChain } from "./core/index.core.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();

loadChain();

app.use(oakCors({ origin: "http://localhost:8083" }));
app.use(router.routes());

console.log("Server is running on port 8090");
await app.listen({ port: 8090 });
