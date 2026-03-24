import { z } from "zod";

export const todoSchema = z.object(
  {
    todo: z
      .string({ error: "Todo is needed" })
      .min(4, "Todo too short")
      .max(30, "Todo too long"),
  },
  { error: "Needed todo" },
);

export type TodoProps = z.infer<typeof todoSchema>;

export const todosParsing = z.array(
  z
    .object({
      id: z.number(),
      user_id: z.uuid(),
      todo: z.string(),
      is_complete: z.boolean(),
      created_at: z.date(),
    })
    .transform((u) => ({
      id: u.id,
      userId: u.user_id,
      todo: u.todo,
      isComplete: u.is_complete,
      createdAt: u.created_at,
    })),
);
