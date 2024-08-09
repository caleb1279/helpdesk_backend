import { Router } from "https://deno.land/x/oak/mod.ts";
import { createTicket, getIncidents, getValidStatuses, updateTicket } from "./routes.ts";
const router = new Router();

router.get("/tickets", (ctx: any) => {
  ctx.response.body = "Helpdesk Service";
});

router.get("/tickets/incidents", getIncidents);
router.post("/tickets/incidents/create", createTicket);
router.post("/tickets/incidents/update", updateTicket);

router.get("/tickets/status", getValidStatuses);

export default router;