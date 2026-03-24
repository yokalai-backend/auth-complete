import { FastifyRequest, FastifyReply } from "fastify";
import { LoginProps, RegisterProps } from "./auth.schema";
import {
  registerService,
  loginService,
  logoutService,
  refreshTokenService,
} from "./auth.service";
import Errors from "../../cores/errors/errors";

export async function register(
  request: FastifyRequest<{ Body: RegisterProps }>,
  reply: FastifyReply,
) {
  await registerService(request.body);

  reply.status(201).send({ success: true, message: "Account registered" });
}

export async function login(
  request: FastifyRequest<{ Body: LoginProps }>,
  reply: FastifyReply,
) {
  const result = await loginService(request.body);

  reply.setCookie("refreshTokens", result.tokens.refreshToken, {
    httpOnly: true,
    path: "/auth",
    maxAge: 7 * 24 * 60 * 60,
  });

  const user = {
    name: result.name,
    role: result.role,
    accessToken: result.tokens.accessToken,
  };

  reply.send({ success: true, message: "Login successful", data: user });
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.refreshTokens;

  if (!token) {
    throw Errors.badRequest("Login first", "UNAUTHORIZED");
  }

  await logoutService(token);

  reply.clearCookie("refreshTokens", { path: "/auth" });

  reply.send({ success: true, message: "Logout successful" });
}

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.cookies.refreshTokens;

  if (!token) {
    throw Errors.unauthorized("Login first", "UNAUTHORIZED");
  }

  const tokens = await refreshTokenService(token);

  reply.setCookie("refreshTokens", tokens.refreshToken, {
    httpOnly: true,
    path: "/auth",
    maxAge: 7 * 24 * 60 * 60,
  });

  return { accessToken: tokens.accessToken };
}
