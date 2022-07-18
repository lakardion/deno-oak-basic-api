import { Router } from "https://deno.land/x/oak/mod.ts";

interface Todo {
  id: string;
  text: string;
}

const todos: Todo[] = [];

const router = new Router();
router.get("/todos", ({ response: res }) => {
  res.body = { todos: todos };
});

router.post("/todos", async ({ request: req, response: res }) => {
  const data = req.body();
  const newTodo: Todo = {
    id: Date.now().toString(),
    text: data.type === "json" ? (await data.value).text : "",
  };
  todos.push(newTodo);
  res.body = newTodo;
});
router.put(
  "/todos/:todoId",
  async ({ request: req, response: res, params }) => {
    const { todoId } = params;
    const data = await req.body().value;
    const todo = todos.find((todo) => todo.id === todoId);
    if (todo) {
      todo.text = data.text;
    }
    res.body = todo;
  }
);
router.delete("/todos/:todoId", ({ response: res, params }) => {
  const { todoId } = params;
  const todoIdx = todos.findIndex((t) => t.id === todoId);
  if (todoIdx !== -1) {
    todos.splice(todoIdx, 1);
    return (res.status = 200);
  }
  res.status = 404;
});

export { router as todosRouter };
