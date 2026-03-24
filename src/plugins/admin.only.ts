import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import Errors from "../cores/errors/errors";

async function adminOnly(app: FastifyInstance) {
  app.addHook("preValidation", async (req: any) => {
    const user = req.user;

    if (user.role !== "admin") {
      throw Errors.forbidden("Forbidden", "FORBIDDEN");
    }
  });
}

export default fp(adminOnly);
