import { queryMany, queryOne } from "../../../cores/utils/query";
import { TotalUsers, Users } from "./admin.type";

const adminRepo = {
  getUsers: async (limit: number, offset: number) => {
    const users = await queryMany<Users>(
      "SELECT id, name, role, is_delete FROM users WHERE role = $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3",
      ["user", limit, offset],
    );

    const total = await queryMany<TotalUsers>("SELECT COUNT(*) FROM users");

    return { users, total: Number(total[0].count) };
  },

  softDeleteUser: async (userId: string) => {
    return (await queryOne(
      "UPDATE users SET is_delete = $1 WHERE id = $2 RETURNING name",
      [true, userId],
    )) as { name: string };
  },

  hardDeleteUser: async (userId: string) => {
    return (await queryOne("DELETE FROM users WHERE id = $1 RETURNING name", [
      userId,
    ])) as { name: string };
  },

  restoreDeletedUser: async (userId: string) => {
    return (await queryOne(
      "UPDATE users SET is_delete = $1 WHERE id = $2 AND is_delete = $3 RETURNING name",
      [false, userId, true],
    )) as { name: string };
  },

  updateUserRole: async (userId: string) => {
    return (await queryOne(
      "UPDATE users SET role = $1 WHERE id = $2 AND role = $3 RETURNING name",
      ["admin", userId],
    )) as { name: string };
  },
};

export default adminRepo;
