import { AppError } from "./app.error";

const Errors = {
  badRequest: (msg = "BAD_REQUEST", code: string) =>
    new AppError(msg, 400, code),
  notFound: (msg = "NOT_FOUND", code: string) => new AppError(msg, 404, code),
  conflict: (msg = "CONFLICT", code: string) => new AppError(msg, 409, code),
  unauthorized: (msg = "UNAUTHORIZED", code: string) =>
    new AppError(msg, 401, code),
  forbidden: (msg = "FORBIDDEN", code: string) => new AppError(msg, 403, code),
};

export default Errors;
