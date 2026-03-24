import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { queryOne } from "./query";
import env from "../config/env";
import Errors from "../errors/errors";

export default async function refreshTokenHelper(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH) as {
      id: string;
      jti: string;
    };

    const isDeleted = await queryOne(
      "SELECT name FROM users WHERE id = $1 AND is_delete = $2",
      [decoded.id, true],
    );

    if (isDeleted) {
      await queryOne("DELETE FROM refresh_tokens WHERE user_id = $1", [
        decoded.id,
      ]);

      throw Errors.notFound("User not exists", "NOT_FOUND");
    }

    const revoke = await queryOne(
      "DELETE FROM refresh_tokens WHERE token_id = $1 RETURNING token_id",
      [decoded.jti],
    ); // Revoke token from database

    if (!revoke) {
      await queryOne("DELETE FROM refresh_tokens WHERE user_id = $1", [
        decoded.id,
      ]);

      throw Errors.unauthorized("Token reuse detected!", "TOKEN_REUSE");
    }

    const newJti = randomUUID(); // Generate new json token id

    const rotation = jwt.sign(
      { id: decoded.id, jti: newJti },
      env.JWT_REFRESH,
      { expiresIn: "7d" },
    ); // New refresh token

    await queryOne(
      "INSERT INTO refresh_tokens (user_id, token_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')",
      [decoded.id, newJti],
    ); // Save new refresh token into database

    const accessTokenPayload = (await queryOne(
      "SELECT id, role FROM users WHERE id = $1",
      [decoded.id],
    )) as { id: string; role: string }; // New access token

    return {
      accessTokenPayload: accessTokenPayload,
      refreshToken: rotation,
    };
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw Errors.unauthorized("Refresh token expired", "TOKEN_EXPIRED");
    }

    if (error instanceof JsonWebTokenError) {
      throw Errors.unauthorized("Refresh token invalid", "TOKEN_INVALID");
    }

    throw error;
  }
}

//adding refresh token rotation!
