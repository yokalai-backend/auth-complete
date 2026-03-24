import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { queryOne } from "../cores/utils/query";
import Errors from "../cores/errors/errors";

async function isUserDeleted(app: FastifyInstance) {
  app.addHook("preValidation", async (req: any) => {
    const user = req.user;

    const result = await queryOne(
      "SELECT name FROM users WHERE id = $1 AND is_delete = $2",
      [user.id, false],
    );

    if (!result) {
      throw Errors.unauthorized("Access denied", "ACCESS_DENIED");
    }
  });
}

export default fp(isUserDeleted);
