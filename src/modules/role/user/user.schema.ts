import { z } from "zod";

export const updateSchema = z
  .object({
    name: z
      .string({ error: "Name required" })
      .trim()
      .min(4, "Name too short")
      .max(12, "Name too long")
      .regex(
        /^(?!.*[_.]{2})[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/,
        "Username invalid",
      )
      .optional(),
    password: z
      .string({ error: "Password required" })
      .trim()
      .min(6, "Password too short")
      .max(16, "Password too long")
      .regex(/^[a-zA-Z0-9!@#%]+$/, "Password invalid")
      .optional(),
  })
  .superRefine((u, ctx) => {
    if (!u.name && !u.password) {
      ctx.addIssue({
        code: "custom",
        message: "At least name or password must be included",
        params: {
          code: "INVALID_CREDENTIALS",
        },
      });
    }
  });

export type UpdateProps = z.infer<typeof updateSchema>;
