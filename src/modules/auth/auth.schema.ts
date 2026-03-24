import { z } from "zod";

export const registerSchema = z.object(
  {
    name: z
      .string({ error: "Name required" })
      .trim()
      .min(4, "Name too short")
      .max(12, "Name too long")
      .regex(
        /^(?!.*[_.]{2})[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/,
        "Username invalid",
      ),
    password: z
      .string({ error: "Password required" })
      .trim()
      .min(6, "Password too short")
      .max(16, "Password too long")
      .regex(/^[a-zA-Z0-9!@#%]+$/, "Password invalid"),
  },
  { error: "Invalid input, name and password required" },
);

export type RegisterProps = z.infer<typeof registerSchema>;

export const loginSchema = z.object(
  {
    name: z.string({ error: "Name required" }),
    password: z.string({ error: "Password required" }),
  },
  { error: "Invalid input, name and password required" },
);

export type LoginProps = z.infer<typeof loginSchema>;
