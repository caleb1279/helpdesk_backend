import { Client } from "https://deno.land/x/mysql/mod.ts";

const client = await new Client().connect({
  hostname: Deno.env.get("MYSQL_URL"),
  username: Deno.env.get("MYSQL_USER"),
  db: Deno.env.get("MYSQL_DATABASE"),
  password: Deno.env.get("MYSQL_PASSWORD"),
});

export default client;