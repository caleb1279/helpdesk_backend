export async function createIncidentTicket() {
    let uuid = crypto.randomUUID();
    let messageBuffer = new TextEncoder().encode(uuid);
    let hashBuffer = crypto.subtle.digest("SHA-384", messageBuffer);
    let hash = btoa(
      String.fromCharCode.apply(
        null,
        new Uint8Array(await crypto.subtle.digest("SHA-256", await hashBuffer)),
      ),
    );
    let ticket = hash
      .substring(0, 10)
      .replace(/[^a-z0-9]+/gi, "")
      .toUpperCase();
    return { hash, ticket };
  }