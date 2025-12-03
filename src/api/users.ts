import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors.js";
import { createUser } from "../db/queries/users.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
  };
  const params: parameters = req.body;

  if (!params.email) {
    throw new BadRequestError("Email is required to create a user.");
  }

  const user = await createUser({ email: params.email });

  if (!user) {
    throw new Error("Failed to create user.");
  }

  respondWithJSON(res, 201, user);
}
