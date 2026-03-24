import { PageProps } from "../../global.schema";
import { todosParsing } from "./todo.schema";
import todoRepo from "./todo.repository";
import Errors from "../../cores/errors/errors";
import buildPagination from "../../cores/utils/build.page";

export async function getTodosService(
  userId: string,
  { page, limit }: PageProps,
) {
  const offset = (page - 1) * limit;

  const result = await todoRepo.getTodos(userId, limit, offset);

  const { todos, total } = result;

  const meta = buildPagination(total, { page, limit });

  return {
    data: todosParsing.parse(todos),
    meta,
  };
}

export async function addTodoService(userId: string, newTodo: string) {
  await todoRepo.addTodo(userId, newTodo);
}

export async function deleteTodoService(userId: string, todoId: number) {
  if (!todoId) {
    throw Errors.badRequest("Todo id invalid", "INVALID_INPUT");
  }

  const deletedTodo = await todoRepo.deleteTodo(userId, todoId);

  if (!deletedTodo) {
    throw Errors.notFound("Todo not exists", "NOT_FOUND");
  }

  return { deletedTodo: deletedTodo };
}

export async function editTodoService(
  editTo: string,
  userId: string,
  todoId: number,
) {
  const result = await todoRepo.editTodo(editTo, userId, todoId);

  if (!result) {
    throw Errors.notFound("Todo not exists", "NOT_FOUND");
  }

  return { updatedTodo: result.todo };
}

export async function completeTodoService(
  isComplete: boolean,
  userId: string,
  todoId: number,
) {
  if (!isComplete) {
    throw Errors.badRequest("Invalid query", "INVALID_INPUT");
  }

  const result = await todoRepo.completeTodo(isComplete, userId, todoId);

  if (!result) {
    throw Errors.notFound("Todo not found", "NOT_FOUND");
  }

  return result;
}
