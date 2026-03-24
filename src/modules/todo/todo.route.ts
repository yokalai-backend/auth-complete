import { FastifyInstance } from "fastify";
import {
  addTodo,
  deleteTodo,
  getTodos,
  completeTodo,
  editTodo,
} from "./todo.controller";
import verifyToken from "../../plugins/verify.token";
import { todoSchema } from "./todo.schema";
import { pageSchema } from "../../global.schema";
import { bodyValidation, queryValidation } from "../../cores/utils/validate";
import isMaximumTodoReach from "../../cores/utils/todo.maximum";
import isUserDeleted from "../../plugins/deleted.user";

export default async function todoRoute(app: FastifyInstance) {
  app.register(verifyToken);

  app.register(isUserDeleted);

  app.get(
    "/todos",
    {
      preValidation: queryValidation(pageSchema),
    },
    getTodos,
  ); // Get todos by user id ordered asc

  app.post(
    "/new-todo",
    {
      preValidation: bodyValidation(todoSchema),
      preHandler: isMaximumTodoReach,
    },
    addTodo,
  ); // Adding new todo

  app.delete("/:id", deleteTodo); // Delete todo by id

  app.patch("/:id", { preValidation: bodyValidation(todoSchema) }, editTodo); // Edit todo

  app.patch("/todo-complete/:id", completeTodo); // Patch for completeTodo
}
