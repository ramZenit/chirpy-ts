import { eq } from "drizzle-orm";
import { db } from "../index.js";
import type { NewUser, User } from "../schema.js";
import { users } from "../schema.js";
import { firstOrUndefined } from "./utils.js";

export async function createUser(user: NewUser) {
  const result = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return firstOrUndefined<User>(result);
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return firstOrUndefined<User>(result);
}

export async function getUserByID(userId: string) {
  const result = await db.select().from(users).where(eq(users.id, userId));
  return firstOrUndefined<User>(result);
}

export async function truncateUsers() {
  await db.execute(`TRUNCATE TABLE users CASCADE;`);
}
