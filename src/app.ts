import fastify from "fastify";
import errorHandler from "./plugins/error.handler";
import authRoute from "./modules/auth/auth.route";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import todoRoute from "./modules/todo/todo.route";
import { userRoute } from "./modules/role/user/user.route";
import adminRoute from "./modules/role/admin/admin.route";

export default async function buildApp() {
  const app = fastify();

  app.register(cookie);
  app.register(errorHandler);
  app.register(rateLimit);

  app.register(authRoute, { prefix: "/auth" });
  app.register(adminRoute, { prefix: "/admin" });
  app.register(userRoute, { prefix: "/user" });
  app.register(todoRoute, { prefix: "/todo" });

  return app;
}
