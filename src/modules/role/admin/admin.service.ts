import adminRepo from "./admin.repository";
import buildPagination from "../../../cores/utils/build.page";
import Errors from "../../../cores/errors/errors";
import { PageProps } from "../../../global.schema";

export async function getUsersService({ page, limit }: PageProps) {
  const offset = (page - 1) * limit;

  const { users, total } = await adminRepo.getUsers(limit, offset);

  const meta = buildPagination(total, { page, limit });

  return {
    users,
    meta,
  };
}

export async function deleteUserService(userId: string, method: string) {
  let deletedUser;

  if (method === "soft") {
    const result = await adminRepo.softDeleteUser(userId);

    deletedUser = result.name;
  } else {
    const result = await adminRepo.hardDeleteUser(userId);

    deletedUser = result.name;
  }

  if (!deletedUser) throw Errors.notFound("User not exists", "NOT_FOUND");

  return { deletedUser: deletedUser, meta: method };
}

export async function restoreDeletedUserService(userId: string) {
  const result = await adminRepo.restoreDeletedUser(userId);

  if (!result) {
    throw Errors.notFound(
      "User with the condition does not exists",
      "NOT_FOUND",
    );
  }

  return { restoredUser: result.name };
}

export async function updateUserRoleService(userId: string) {
  const result = await adminRepo.updateUserRole(userId);

  if (!result) {
    throw Errors.notFound("User role or id does not match", "NOT_FOUND");
  }

  return {
    updatedUser: result.name,
  };
}
