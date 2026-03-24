import { queryOne } from "../../cores/utils/query";

const authRepo = {
  register: async (name: string, hashed: string) => {
    await queryOne("INSERT INTO users (name, hash) VALUES ($1, $2)", [
      name,
      hashed,
    ]);
  },

  login: async (name: string) => {
    return (await queryOne(
      "SELECT id, role, hash FROM users WHERE name = $1 AND is_delete = $2",
      [name, false],
    )) as { id: string; role: string; hash: string } | null;
  },

  logout: async (jti: string) => {
    return await queryOne(
      "DELETE FROM refresh_tokens WHERE token_id = $1 RETURNING token_id",
      [jti],
    );
  },

  saveRefreshToken: async (userId: string, jti: string) => {
    await queryOne(
      "INSERT INTO refresh_tokens (user_id, token_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')",
      [userId, jti],
    );
  },
};

export default authRepo;
