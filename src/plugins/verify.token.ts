import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import fp from "fastify-plugin";
import Errors from "../cores/errors/errors";
import jwt from "jsonwebtoken";
import env from "../cores/config/env";

async function verifyToken(app: FastifyInstance) {
  app.addHook(
    "preValidation",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const headers = request.headers.authorization;

      if (!headers) {
        throw Errors.unauthorized("Token not provided", "NO_TOKEN");
      }

      if (!headers.startsWith("Bearer ")) {
        throw Errors.unauthorized(
          "Invalid token format",
          "INVALID_CREDENTIALS",
        );
      }

      const token = headers.split(" ")[1];

      try {
        const decoded = jwt.verify(token, env.JWT_ACCESS) as {
          id: string;
          role: string;
        };

        request.user = {
          ...decoded,
        };
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw Errors.unauthorized("Token expired", "TOKEN_EXPIRED");
        }

        if (error instanceof JsonWebTokenError) {
          throw Errors.unauthorized("Token invalid", "TOKEN_INVALID");
        }

        throw error;
      }
    },
  );
}

export default fp(verifyToken);
