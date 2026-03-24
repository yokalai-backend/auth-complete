import userRepo from "./user.repository";
import Errors from "../../../cores/errors/errors";
import { hashPassword } from "../../../cores/utils/hash";
import { UpdateProps } from "./user.schema";

export async function getDataService(userId: string) {
  const user = await userRepo.userDataById(userId);

  return {
    id: userId,
    name: user.name,
    role: user.role,
    createdAt: user.created_at,
  };
}

export async function updateDataService(userId: string, input: UpdateProps) {
  try {
    let hashed;

    if (input.password) hashed = await hashPassword(input.password);

    const user = await userRepo.userUpdate(userId, input.name, hashed);

    let updatedKey = input.name ? "newName" : "name";
    let updatedMessage;

    if (input.name && input.password) {
      updatedMessage = "Name and password is updated";
    } else if (input.name) {
      updatedMessage = "Name is updated";
    } else {
      updatedMessage = "Password is updated";
    }

    return {
      id: userId,
      [updatedKey]: user.name,
      role: user.role,
      message: updatedMessage,
    };
  } catch (error: any) {
    if (error.code === "23505") {
      throw Errors.conflict("User already exists", "USER_EXISTS");
    }

    throw error;
  }
}

export async function deleteDataService(userId: string) {
  const deletedUser = await userRepo.userDelete(userId);

  return { deletedUser: deletedUser };
}
