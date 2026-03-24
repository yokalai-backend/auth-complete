import { LoginProps, RegisterProps } from "./auth.schema";
import { hashPassword, verifyPassword } from "../../cores/utils/hash";
import { randomUUID } from "crypto";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import refreshTokenHelper from "../../cores/utils/refresh.token";
import env from "../../cores/config/env";
import authRepo from "./auth.repository";
import Errors from "../../cores/errors/errors";

export async function registerService({ name, password }: RegisterProps) {
  try {
    const hashed = await hashPassword(password);

    await authRepo.register(name, hashed);
  } catch (error: any) {
    if (error.code === "23505") {
      throw Errors.conflict("User already exists", "USER_EXISTS");
    }

    throw error;
  }
}

export async function loginService({ name, password }: LoginProps) {
  const user = await authRepo.login(name);

  if (!user) {
    throw Errors.unauthorized(
      "Username or password invalid",
      "INVALID_CREDENTIALS",
    );
  }

  const verified = await verifyPassword(password, user.hash);

  if (!verified) {
    throw Errors.unauthorized(
      "Username or password invalid",
      "INVALID_CREDENTIALS",
    );
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_ACCESS,
    { expiresIn: "15m" },
  );

  const jti = randomUUID();

  const refreshToken = jwt.sign(
    {
      id: user.id,
      jti: jti,
    },
    env.JWT_REFRESH,
    { expiresIn: "7d" },
  );

  await authRepo.saveRefreshToken(user.id, jti);

  const tokens = { accessToken, refreshToken };

  return {
    name: name,
    role: user.role,
    tokens,
  };
}

export async function logoutService(token: string) {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH, {
      ignoreExpiration: true,
    }) as { id: string; jti: string };

    await authRepo.logout(decoded.jti);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw Errors.unauthorized("Token invalid", "INVALID_TOKEN");
    }

    throw error;
  }
}

export async function refreshTokenService(refreshToken: string) {
  const tokens = await refreshTokenHelper(refreshToken);

  const newAccessToken = jwt.sign(tokens.accessTokenPayload, env.JWT_ACCESS, {
    expiresIn: "15m",
  });

  return {
    accessToken: newAccessToken,
    refreshToken: tokens.refreshToken,
  };
}
