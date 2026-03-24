import { z } from "zod";

export const deleteSchema = z.object(
  {
    method: z.enum(["soft", "hard"], {
      error: "Method invalid only soft and hard allowed",
    }),
  },
  { error: "Needed method" },
);

export type DeleteProps = z.infer<typeof deleteSchema>;
