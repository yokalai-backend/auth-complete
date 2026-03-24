import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../cores/errors/app.error";
import fp from "fastify-plugin";
import { ZodError } from "zod";

function errorHandler(app: FastifyInstance) {
  app.setErrorHandler(
    async (error: any, request: FastifyRequest, reply: FastifyReply) => {
      console.error(error);

      if (error.code === "FST_ERR_CTP_INVALID_JSON_BODY") {
        return reply.status(400).send({
          success: false,
          error: { message: "Invalid json", code: "INVALID_JSON" },
        });
      }

      if (error.code === "22P02") {
        return reply.status(400).send({
          success: false,
          error: {
            message: "Invalid ID format",
            code: "INVALID_ID",
          },
        });
      }

      if (error.code === "TOO_MANY") {
        const { statusCode, ...formatted } = error;

        return reply.status(error.statusCode).send({
          success: false,
          error: formatted,
        });
      }

      if (error instanceof ZodError) {
        const issue = error.issues[0];

        const code = issue.code === "custom" ? issue.params?.code : issue.code;

        const formatted = {
          message: issue.message,
          code: (code || "VALIDATION_ERROR").toUpperCase(),
        };

        return reply.status(400).send({
          success: false,
          error: formatted,
        });
      }
      if (error instanceof AppError) {
        const formatted = {
          message: error.message,
          code: error.code,
        };

        return reply
          .status(error.statusCode)
          .send({ success: false, error: formatted });
      }

      reply.status(500).send({
        success: false,
        error: { message: "Internal server error", code: "INTERNAL_ERROR" },
      });
    },
  );
}

export default fp(errorHandler);
