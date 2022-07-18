import "https://deno.land/std@v0.148.0/dotenv/load.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";
import { connect } from "./helpers/db.ts";
import { todosRouter } from "./routes/todos.ts";

const app = new Application();

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});
app.use(todosRouter.routes());
app.use(todosRouter.allowedMethods());
// app.use((ctx) => {
//   ctx.response.body = "Hello world?";
// });

await connect();
console.log("Db connected!");
await app.listen({ port: 8000 });
