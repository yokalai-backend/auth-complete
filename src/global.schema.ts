import { z } from "zod";

export const pageSchema = z.object({
  page: z.coerce.number().min(1, "Page can't be 0").default(1),
  limit: z.coerce
    .number()
    .min(10, "Min limit is 10")
    .max(15, "Max limit is 15")
    .default(10),
});

export type PageProps = z.infer<typeof pageSchema>;

export const userExistsSchema = z.object(
  {
    id: z.uuid({ error: "User id not valid" }),
  },
  { error: "Needed user id" },
);
