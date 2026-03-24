import { FastifyInstance } from "fastify";
import { loginSchema, registerSchema } from "./auth.schema"; // Schema for body validation
import { bodyValidation } from "../../cores/utils/validate"; // Schema wrapper
import { register, login, refreshToken, logout } from "./auth.controller"; // Import controllers
import rateLimitConfig from "../../cores/config/auth.rate.limit"; // Config for limmiting requests

export default async function authRoute(app: FastifyInstance) {
  app.post(
    "/register",
    {
      preHandler: bodyValidation(registerSchema),
      config: rateLimitConfig("register"),
    },
    register,
  ); // Register new account

  app.post(
    "/login",
    {
      preHandler: bodyValidation(loginSchema),
      config: rateLimitConfig("login"),
    },
    login,
  ); // Added access + refresh token

  app.post("/logout", logout); // Remove refresh token left access token remaining for a while

  app.post(
    "/refresh-token",
    { config: rateLimitConfig("refreshToken") },
    refreshToken,
  ); // Refresh token from cookies
}
