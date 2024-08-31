import { serve } from "@hono/node-server";
import { Hono } from "hono";
import prisma from "./lib/prisma";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
  })
);

app.get("/", async (ctx) => {
  const todos = await prisma.todo.findMany();

  return ctx.json(todos);
});

app.post("/new", async (ctx) => {
  const body = await ctx.req.json();

  const todo = await prisma.todo.create({
    data: {
      title: body.title,
    },
  });

  return ctx.json(todo);
});

app.patch("/update/:id", async (ctx) => {
  const id = ctx.req.param("id");
  const body = await ctx.req.json();

  const todo = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      completed: body.completed,
    },
  });

  return ctx.json(todo);
});

app.delete("/delete/:id", async (ctx) => {
  const id = ctx.req.param("id");

  const todo = await prisma.todo.delete({
    where: {
      id,
    },
  });

  return ctx.json(todo);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
