import { FastifyRequest, FastifyReply } from "fastify";
import {
  getTodosService,
  addTodoService,
  deleteTodoService,
  completeTodoService,
  editTodoService,
} from "./todo.service";
import { TodoProps } from "./todo.schema";
import { PageProps } from "../../global.schema";

export async function getTodos(
  request: FastifyRequest<{ Querystring: PageProps }>,
  reply: FastifyReply,
) {
  const user = request.user!;

  const result = await getTodosService(user.id, request.query);

  reply.send({ success: true, message: "Todos received", ...result });
}

export async function addTodo(
  request: FastifyRequest<{ Body: TodoProps }>,
  reply: FastifyReply,
) {
  const user = request.user!;

  const newTodo = request.body.todo;

  await addTodoService(user.id, newTodo);

  reply.status(201).send({ success: true, message: "Added todo" });
}

export async function deleteTodo(
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) {
  const user = request.user!;
  const todoId = Number(request.params.id);

  const result = await deleteTodoService(user.id, todoId);

  reply.send({ success: true, message: "Delete todo completed", data: result });
}

export async function editTodo(
  request: FastifyRequest<{ Params: { id: number }; Body: { todo: string } }>,
  reply: FastifyReply,
) {
  const user = request.user!;

  const todoId = request.params.id;

  const result = await editTodoService(request.body.todo, user.id, todoId);

  reply.send({ success: true, messsage: "Todo updated", data: result });
}

export async function completeTodo(
  request: FastifyRequest<{
    Params: { id: number };
    Querystring: { isComplete: boolean };
  }>,
  reply: FastifyReply,
) {
  const user = request.user!;

  const isComplete = request.query;

  const todoId = Number(request.params.id);

  const result = await completeTodoService(
    isComplete.isComplete,
    user.id,
    todoId,
  );

  reply.send({ success: true, message: "Todo updated", data: result });
}
