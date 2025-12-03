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

export async function truncateUsers() {
  await db.execute(`TRUNCATE TABLE users CASCADE;`);
}
