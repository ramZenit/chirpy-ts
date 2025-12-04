import { eq } from "drizzle-orm";
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

export async function getAllChirp() {
  return (await db.select().from(chirps)) as Chirp[];
}

export async function getChirpById(id: string) {
  const result = await db.select().from(chirps).where(eq(chirps.id, id));
  return firstOrUndefined<Chirp>(result);
}
