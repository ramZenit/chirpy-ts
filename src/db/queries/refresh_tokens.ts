import { eq } from "drizzle-orm";
import { db } from "../index.js";
import type { NewRefreshToken, RefreshToken } from "../schema.js";
import { refreshTokens } from "../schema.js";
import { firstOrUndefined } from "./utils.js";

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const result = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();
  return firstOrUndefined<RefreshToken>(result);
}

export async function getRefreshToken(token: string) {
  const result = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  return firstOrUndefined<RefreshToken>(result);
}

export async function updateRefreshToken(
  token: string,
  refreshToken: Partial<RefreshToken>
) {
  const result = await db
    .update(refreshTokens)
    .set(refreshToken)
    .where(eq(refreshTokens.token, token))
    .returning();
  return firstOrUndefined<RefreshToken>(result);
}
