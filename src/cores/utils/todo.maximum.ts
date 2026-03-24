import { queryOne } from "./query";
import Errors from "../errors/errors";

interface TotalTodo {
  total: number;
}

export default async function isMaximumTodoReach(request: any, reply: any) {
  const user = request.user!;

  const result = await queryOne<TotalTodo>(
    "SELECT COUNT(*) AS total FROM todos WHERE user_id = $1",
    [user.id],
  );

  let total = Number(result?.total);

  if (total >= 30) {
    throw Errors.badRequest("Todo reach maximum", "MAXIMUM");
  }
}
