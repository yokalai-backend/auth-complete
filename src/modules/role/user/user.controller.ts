import { FastifyRequest, FastifyReply } from "fastify";
import { UpdateProps } from "./user.schema";
import {
  getDataService,
  updateDataService,
  deleteDataService,
} from "./user.service";

export async function userData(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user!;

  const result = await getDataService(user.id);

  reply.send({ success: true, message: "Data received", data: result });
}

export async function updateData(
  request: FastifyRequest<{ Body: UpdateProps }>,
  reply: FastifyReply,
) {
  const user = request.user!;

  const { message, ...result } = await updateDataService(user.id, request.body);

  reply.send({ success: true, message: message, data: result });
}

export async function deleteData(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user!;

  const result = await deleteDataService(user.id);

  reply.send({
    success: true,
    message: "Data successfuly deleted",
    data: result,
  });
}
