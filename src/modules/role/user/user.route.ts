import { FastifyInstance } from "fastify";
import { userData, updateData, deleteData } from "./user.controller";
import { updateSchema } from "./user.schema";
import { bodyValidation } from "../../../cores/utils/validate";
import verifyToken from "../../../plugins/verify.token";
import isUserDeleted from "../../../plugins/deleted.user";

export async function userRoute(app: FastifyInstance) {
  app.register(verifyToken); // User have to login first

  app.register(isUserDeleted);

  app.get("/data", userData); // Get user's data
  app.put("/data", { preValidation: bodyValidation(updateSchema) }, updateData); // Update name or password
  app.delete("/data", deleteData); // Delete own data
}
