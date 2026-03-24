import { FastifyRequest, FastifyReply } from "fastify";
import { PageProps } from "../../../global.schema";
import {
  deleteUserService,
  getUsersService,
  restoreDeletedUserService,
  updateUserRoleService,
} from "./admin.service";
import { DeleteProps } from "./admin.schema";

export async function getUsers(
  request: FastifyRequest<{ Querystring: PageProps }>,
  reply: FastifyReply,
) {
  const result = await getUsersService(request.query);

  reply.send({ success: true, message: "Get all users", ...result });
}

export async function deleteUser(
  request: FastifyRequest<{
    Params: { id: string };
    Querystring: DeleteProps;
  }>,
  reply: FastifyReply,
) {
  const method = request.query.method;

  const result = await deleteUserService(request.params.id, method);

  reply.send({
    success: true,
    message: `Complete delete user`,
    data: result,
  });
}

export async function restoreDeletedUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const result = await restoreDeletedUserService(request.params.id);

  reply.send({
    success: true,
    message: "User restored successful",
    data: result,
  });
}

export async function updateRoleUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const result = await updateUserRoleService(request.params.id);

  reply.send({ success: true, message: "User updated", data: result });
}
