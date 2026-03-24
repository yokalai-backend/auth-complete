import { queryOne } from "../../../cores/utils/query";

const userRepo = {
  userDataById: async (userId: string) => {
    return (await queryOne(
      "SELECT name, role, created_at FROM users WHERE id = $1",
      [userId],
    )) as {
      name: string;
      role: string;
      created_at: string;
    };
  },

  userUpdate: async (userId: string, name?: string, password?: string) => {
    const fields = [];
    const params = [];
    let i = 1;

    if (name) {
      fields.push(`name = $${i++}`);
      params.push(name);
    }

    if (password) {
      fields.push(`hash = $${i++}`);
      params.push(password);
    }

    params.push(userId);

    const queryStr = `UPDATE users SET ${fields.join(", ")} WHERE id = $${i} RETURNING id, name, role`;

    return (await queryOne(queryStr, params)) as {
      id: string;
      name: string;
      role: string;
    };
  },

  userDelete: async (userId: string) => {
    return await queryOne(
      "DELETE FROM users WHERE id = $1 RETURNING id, name, role",
      [userId],
    );
  },
};

export default userRepo;
