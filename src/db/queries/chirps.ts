import { db } from "../index.js";
import type { NewChirp, Chirp } from "../schema.js";
import { chirps } from "../schema.js";
import { firstOrUndefined } from "./utils.js";

export async function createChirp(chirp: NewChirp) {
  const result = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return firstOrUndefined<Chirp>(result);
}
