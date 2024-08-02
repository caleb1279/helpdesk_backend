import {
  Event,
  chain,
  validStates,
  Comment,
  comments,
  saveChain,
} from "../core/index.core.ts";

export const updateComment = async (ctx: any): Promise<void> => {
  let id = ctx.params.id;
  let comment = comments.find((comment) => comment.id == id);
  if (comment != null) {
    comment.changeContent(ctx.params.content);
		console.log(comment);
    saveChain();
    ctx.response.body = comment;
  } else {
    ctx.response.status = 400;
    ctx.response.body = "Error";
  }
};

export const createComment = async (ctx: any): Promise<void> => {
  let ticket = ctx.params.ticket;
  if (chain.searchEvent(ticket) !== null) {
    let comment = new Comment(
      ctx.params.author,
      ctx.params.ticket,
      ctx.params.content,
    );
    comments.push(comment);
		console.log(comment);
    saveChain();
    ctx.response.body = comment;
  } else {
    ctx.response.status = 400;
    ctx.response.body = "Error";
  }
};

export const getComments = async (ctx: any): Promise<void> => {
  let ticket = ctx.request.url.searchParams.get("ticket");
  let id: number | null = ctx.request.url.searchParams.get("id");
  if (ticket == null && id == null) {
    ctx.response.body = comments;
  } else if (ticket == null && id != null) {
    let comment = comments.filter((cmt) => cmt.id == id);
    console.log(comment, id);
    if (comment != null) {
      ctx.response.body = comment;
    } else {
      ctx.response.status = 400;
      ctx.response.body = "Error";
    }
  } else {
    if (chain.searchEvent(ticket)) {
      ctx.response.body = comments.filter(
        (comment) => comment.getTicket() === ticket,
      );
    } else {
      ctx.response.status = 400;
      ctx.response.body = "Error";
    }
  }
};

export const getValidIncidentStatus = async (ctx: any): Promise<void> => {
  let ticket = await ctx.request.url.searchParams.get("ticket");
  if (ticket == null) {
    ctx.response.body = validStates;
  } else {
    let event = chain.searchEvent(ticket);
    if (event != null) {
      ctx.response.body = event.status;
    } else {
      ctx.response.status = 400;
      ctx.response.body = "Error";
    }
  }
};

export const changeIncidentState = async (ctx: any): Promise<void> => {
  let ticket = ctx.params.ticket;
  let newStatus = ctx.params.newStatus;
  let event = chain.searchEvent(ticket);
  if (validStates.filter((s) => s === newStatus) !== null && event !== null) {
    event.status.state = newStatus;
    saveChain();
    console.log(event);
    ctx.response.body = event;
  } else {
    ctx.response.status = 400;
    ctx.response.body = "Error";
  }
};

export const createIncident = async (ctx: any): Promise<void> => {
  let user: number = ctx.params.user;
  let subject: string = ctx.params.subject;
  let description: string = ctx.params.description;
  let event = new Event(user, subject, description);
  if (await chain.addEvent(event)) {
    saveChain();
    console.log(event);
    ctx.response.body = event;
  } else {
    ctx.response.status = 400;
    ctx.response.body = "Error";
  }
};

export const getIncidents = async (ctx: any): Promise<void> => {
  let ticket = await ctx.request.url.searchParams.get("ticket");

  if (ticket == null) {
    let incidents = chain.getEvents();
    ctx.response.body = incidents;
  } else {
    let event = chain.searchEvent(ticket);
    if (event != null) {
      ctx.response.body = event;
    } else {
      ctx.response.status = 400;
      ctx.response.body = "Error";
    }
  }
};
