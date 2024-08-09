import client from "./pool.ts";

export async function getPermissions(user: string) {
  const query = await client.execute(
    `SELECT * FROM Permissions WHERE id="${user}"`
  );
  console.log(query);
  return query.rows;
}

export async function incidents(user: string) {
  const query = await client.execute(
    `SELECT * FROM TicketIncidents WHERE status_id != 2 OR user_id="${user}"`
  );
  console.log(query);
  return query.rows;
}

export async function limited_incidents(user: string) {
  const query = await client.execute(
    `SELECT * FROM TicketIncidents WHERE user_id="${user}";`
  );
  console.log(query);
  return query.rows;
}

export async function systemSpecificTicket(ticket: string) {
  const query = await client.execute(
    `SELECT * FROM TicketIncidents WHERE ticket="${ticket}";`
  );
  console.log(query);
  return query.rows;
}

export async function specificTicket(ticket: string, user: string) {
  const query = await client.execute(
    `SELECT * FROM TicketIncidents WHERE ticket="${ticket}" and (status_id != 2 OR user_id="${user}");`
  );
  console.log(query);
  return query.rows;
}

export async function specificUserTicket(ticket: string, user: string) {
  const query = await client.execute(
    `SELECT * FROM TicketIncidents WHERE ticket="${ticket}" AND user_id=${user};`
  );
  console.log(query);
  return query.rows;
}

export async function validStatuses() {
  const query = await client.execute("SELECT * FROM TicketStatuses;");
  console.log(query);
  return query.rows;
}

export async function newIncident(
  id: string,
  user_id: string,
  subject: string,
  description: string,
  status_id: number,
  ticket: string
) {
  const query = await client.execute(
    `INSERT INTO TicketIncidents (id, user_id, subject, description, status_id, ticket) VALUES ("${id}", "${user_id}", "${subject}", "${description}", ${status_id}, "${ticket}");`
  );
  console.log(query);
  query.affectedRows;
}

export async function searchStatus(status: string) {
  const query = await client.execute(
    `SELECT * FROM TicketStatuses WHERE name="${status}";`
  );
  console.log(query);
  return query.rows;
}

export async function changeTicketStatus(ticket: string, newStatus: number) {
  const query = await client.execute(
    `UPDATE TicketIncidents SET status_id=${newStatus} WHERE ticket="${ticket}";`
  );
  console.log(query);
  return query.affectedRows;
}
