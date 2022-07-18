import { Router } from "https://deno.land/x/oak/mod.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.3/mod.ts";
import { getDb } from "../helpers/db.ts";

interface Todo {
  id?: string;
  text: string;
}

const router = new Router();
router.get("/todos", async ({ response: res }) => {
  const todos = await getDb().collection("todos").find().toArray();
  const mappedTodos = todos.map((td) => ({
    id: td._id.toString(),
    text: td.text,
  }));
  console.log(mappedTodos);
  res.body = { todos: mappedTodos };
});

router.post("/todos", async ({ request: req, response: res }) => {
  const data = req.body();
  const newTodo: Todo = {
    text: data.type === "json" ? (await data.value).text : "",
  };
  const createdTodoId = await getDb().collection("todos").insertOne(newTodo);
  res.body = { id: createdTodoId.toString(), text: newTodo.text };
});
router.put(
  "/todos/:todoId",
  async ({ request: req, response: res, params }) => {
    const { todoId } = params;
    const data = await req.body().value;
    const collection = getDb().collection("todos");
    const filter = { _id: new ObjectId(todoId) };
    const dbTodo = await collection.findOne(filter);
    if (dbTodo) {
      dbTodo.text = data.text;
      await collection.updateOne(filter, { $set: dbTodo });
      res.body = { id: dbTodo?._id.toString(), text: dbTodo.text };
      return (res.status = 200);
    }
    res.body = {
      message: "Not found",
    };
    res.status = 404;
  }
);
router.delete("/todos/:todoId", async ({ response: res, params }) => {
  const { todoId } = params;
  const filter = { _id: new ObjectId(todoId) };
  const todosCollection = getDb().collection("todos");
  const dbTodo = await todosCollection.findOne(filter);
  if (dbTodo) {
    await todosCollection.deleteOne(filter);
    res.body = { message: "Delete success" };
    return (res.status = 200);
  }
  res.body = { message: "Nothing to do" };
  res.status = 404;
});

export { router as todosRouter };
