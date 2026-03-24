import { FastifyInstance } from "fastify";
import { queryValidation } from "../../../cores/utils/validate";
import { pageSchema } from "../../../global.schema";
import { deleteSchema } from "./admin.schema";
import {
  deleteUser,
  getUsers,
  restoreDeletedUser,
  updateRoleUser,
} from "./admin.controller";
import verifyToken from "../../../plugins/verify.token";
import adminOnly from "../../../plugins/admin.only";

export default async function adminRoute(app: FastifyInstance) {
  app.register(verifyToken);

  app.register(adminOnly);

  app.get("/users", { preValidation: queryValidation(pageSchema) }, getUsers);

  app.delete(
    "/user/:id",
    { preValidation: queryValidation(deleteSchema) },
    deleteUser,
  );

  app.patch("/user/restore/:id", restoreDeletedUser);

  app.patch("user/role/:id", updateRoleUser);
}
