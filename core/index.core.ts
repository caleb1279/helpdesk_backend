import * as fs from "node:fs";

export const validStates = ["open", "closed", "solved", "reopen", "remited"];

class Status {
  public state: string;

  constructor() {
    this.state = "open";
  }

  getState(): string {
    return this.state;
  }
}

type Incident = {
  ticket: string;
  hash: string;
};

export class Event {
  public user: number;
  public subject: string;
  public description: string;
  public status: Status;
  public incident: Incident;

  constructor(user: number, subject: string, description: string) {
    this.subject = subject;
    this.description = description;
    this.status = new Status();
    this.incident = { ticket: "0", hash: "0" };
    this.user = user;
  }

  async createIncident() {
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
    return { ticket, hash };
  }

  async setActualIncident() {
    this.incident = await this.createIncident();
  }
}

export class EventChain {
  public events: Array<Event>;

  constructor(events = null) {
    if (events == null) {
      let origin = new Event(NaN, "origin", "origin");
      origin.setActualIncident();
      this.events = [origin];
    } else {
      this.events = events;
    }
  }

  async addEvent(event: Event) {
    await event.setActualIncident();
    this.events.push(event);
    return true;
  }

  getEvents(): Array<Event> {
    return this.events;
  }

  searchEvent(ticket: string): Event | null {
    let res = this.events.filter(
      (event) => event.incident.ticket === ticket,
    );
    if (res.length > 0) {
      return res[0];
    } else {
      return null;
    }
  }

  static fromObj(obj) {
    return new EventChain(obj.events);
  }
}

export var comments: Array<Comment> = [];

export class Comment {
  public id: number;
  public author: string;
  public ticket: string;
  public content: string;

  constructor(author: string, ticket: string, content: string) {
    this.id = comments.length + 1;
    this.author = author;
    this.ticket = ticket;
    this.content = content;
  }

  getAuthor(): string {
    return this.author;
  }

  getTicket(): string {
    return this.ticket;
  }

  getContent(): string {
    return this.content;
  }

  changeContent(content: string): void {
    this.content = content;
  }
}

export var chain = new EventChain();

export function saveChain() {
  var file = 'data.json';
  var data = JSON.stringify(chain);

  fs.writeFile(file, data, function (err: any) {
    if (err) {
      return console.log(err);
    }
  });
}

export function loadChain() {
  var file = 'data.json';
  fs.readFile(file, (err, data) => {
    if (err) {
      throw err;
    } else {
      chain = EventChain.fromObj(JSON.parse(data));
    }
  });
}
