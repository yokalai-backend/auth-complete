import { queryOne, queryMany } from "../../cores/utils/query";
import { Todo, TotalTodo } from "./todo.type";

const todoRepo = {
  getTodos: async (userId: string, limit: number, offset: number) => {
    const todos = await queryMany<Todo>(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3",
      [userId, limit, offset],
    );

    const totalResult = await queryMany<TotalTodo>(
      "SELECT COUNT(*) FROM todos WHERE user_id = $1",
      [userId],
    );

    return {
      todos: todos,
      total: Number(totalResult[0].count),
    };
  },

  addTodo: async (userId: string, newTodo: string) => {
    return await queryOne("INSERT INTO todos (user_id, todo) VALUES ($1, $2)", [
      userId,
      newTodo,
    ]);
  },

  deleteTodo: async (userId: string, todoId: number) => {
    return await queryOne(
      "DELETE FROM todos WHERE user_id = $1 AND id = $2 RETURNING todo",
      [userId, todoId],
    );
  },

  editTodo: async (editTo: string, userId: string, todoId: number) => {
    return (await queryOne(
      "UPDATE todos SET todo = $1 WHERE user_id = $2 AND id = $3 RETURNING todo",
      [editTo, userId, todoId],
    )) as { todo: string };
  },

  completeTodo: async (complete: boolean, userId: string, todoId: number) => {
    return await queryOne(
      "UPDATE todos SET is_complete = $1 WHERE user_id = $2 AND id = $3 RETURNING id, todo, is_complete",
      [complete, userId, todoId],
    );
  },
};

export default todoRepo;
