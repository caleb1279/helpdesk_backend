import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  changeIncidentState,
  createComment,
  createIncident,
  getComments,
  getIncidents,
  getValidIncidentStatus,
  updateComment,
} from "../controllers/index.controllers.ts";
const router = new Router();

router.get("/tickets", (ctx: any) => {
  ctx.response.body = "Hello World!";
});

router.get("/tickets/incidents", getIncidents);
router.get("/tickets/incidents/statuses", getValidIncidentStatus);
router.get("/tickets/comments", getComments);
router.get("/tickets/incidents/create/:user/:subject/:description", createIncident);
router.get("/tickets/comments/create/:ticket/:author/:content", createComment);
router.get("/tickets/incidents/changestatus/:ticket/:newStatus", changeIncidentState);
router.get("/tickets/comments/update/:id/:content", updateComment);

export default router;
