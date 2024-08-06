import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./routes/index.routes.ts";
import { loadChain } from "./core/index.core.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();

loadChain();
const PORT = Deno.env.get("PORT");
const origin = Deno.env.get("ACCEPTED_ORIGIN")

app.use(oakCors({ origin: "*" }));
app.use(router.routes());

console.log("Server is running on port " + PORT);
await app.listen({ port: PORT });
