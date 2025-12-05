import crypto from "crypto";
import {
  createRefreshToken,
  getRefreshToken,
  updateRefreshToken,
} from "../db/queries/refresh_tokens.js";
import { UnauthorizedError } from "../errors.js";

export async function makeRefreshToken(userId: string) {
  const key = crypto.randomBytes(32).toString("hex");

  const refreshToken = await createRefreshToken({
    token: key,
    userId: userId,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    revokedAt: null,
  });

  if (!refreshToken) {
    throw new Error("Failed to create refresh token.");
  }

  return refreshToken.token;
}

export async function checkRefreshToken(token: string) {
  const refreshToken = await getRefreshToken(token);
  if (
    !refreshToken ||
    refreshToken.revokedAt ||
    refreshToken.expiresAt < new Date()
  ) {
    throw new UnauthorizedError("Invalid refresh token.");
  }
  return refreshToken;
}

export async function revokeRefeshToken(token: string) {
  const now = new Date();
  const refreshToken = await updateRefreshToken(token, {
    updatedAt: now,
    revokedAt: now,
  });
  if (!refreshToken) {
    throw new UnauthorizedError("Invalid refresh token.");
  }
}
