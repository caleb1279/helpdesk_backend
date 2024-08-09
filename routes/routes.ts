import {
  validStatuses,
  limited_incidents,
  incidents,
  specificTicket,
  newIncident,
  searchStatus,
  changeTicketStatus,
  getPermissions,
  specificUserTicket,
  systemSpecificTicket,
} from "../database/index.database.ts";
import { createIncidentTicket } from "../utils.ts";

export async function getIncidents(ctx) {
  let ticket = await ctx.request.url.searchParams.get("ticket");
  let user = await ctx.request.headers.get("Authorization");

  if (user == null) {
    ctx.response.status = 400;
    ctx.response.body = "Error";
    return;
  }

  const perm = await getPermissions(user);
  const permission = perm[0];

  if (permission.ticket_permissions < 1) {
    ctx.response.status = 401;
    ctx.response.body = "Error";
  }

  if (ticket == null && permission.ticket_permissions >= 2) {
    const response = await incidents(user);
    ctx.response.body = response;
  } else if (ticket == null && permission.ticket_permissions < 2) {
    const response = await limited_incidents(user);
    ctx.response.body = response;
  } else {
    if (permission.ticket_permissions >= 2) {
      const response = await specificTicket(ticket, user);
      if (response) ctx.response.body = response;
    } else {
      const response = await specificUserTicket(ticket, user);
      if (response) ctx.response.body = response;
    }
  }
}

export async function getValidStatuses(ctx) {
  const response = await validStatuses();
  ctx.response.body = response;
}

export async function createTicket(ctx) {
  const body = await ctx.request.body.json();

  const user: string = body.user;
  const subject: string = body.subject;
  const description: string = body.description;
  const incident = await createIncidentTicket();

  if (user == null || subject == null || description == null) {
    ctx.response.status = 400;
    ctx.response.body = "Error";
    return;
  }

  const response = await newIncident(
    incident.hash,
    user,
    subject,
    description,
    1,
    incident.ticket
  );
  console.log(response);
}

export async function updateTicket(ctx) {
  const body = await ctx.request.body.json();
  const ticket = body.ticket;
  const newState = body.status;
  const obj = await systemSpecificTicket(ticket);
  const status = await searchStatus(newState);

  if (status.length > 0 && obj.length > 0) {
    const user = ctx.request.headers.get('Authorization');
    const perm = await getPermissions(user);
    const permission = perm[0];

    if ((obj.user_id != user && permission.ticket_permissions >= 4) || obj.user_id == user) {
      changeTicketStatus(ticket, status[0].id);
    } else {
      ctx.response.status = 400;
      ctx.response.body = "Error";
    }
  }
}
