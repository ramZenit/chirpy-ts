import type { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "../errors.js";
import { truncateUsers } from "../db/queries/users.js";

export async function handlerReset(_: Request, res: Response) {
  config.api.fileserverHits = 0;
  res.write("Metrics have been reset.");
  if (config.api.platform !== "dev") {
    throw new ForbiddenError(
      "Truncate users is only allowed in dev environment."
    );
  }
  await truncateUsers();
  res.write("\nUser data has been truncated.");
  res.end();
}
