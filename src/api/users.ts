import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError, UnauthorizedError } from "../errors.js";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { hashPassword } from "../auth/hash.js";
import type { User } from "../db/schema.js";
import { checkPasswordHash } from "../auth/hash.js";
import { config } from "../config.js";
import { makeJWT } from "../auth/jwt.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  if (!req.body || !req.body.email || !req.body.password) {
    throw new BadRequestError(
      "Email and Password are required to create a user."
    );
  }

  const params: parameters = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = await createUser({
    email: params.email,
    password: await hashPassword(params.password),
  });

  if (!user) {
    throw new Error("Failed to create user.");
  }

  respondWithJSON(res, 201, sanitizeUser(user));
}

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
    expireInSeconds: number;
  };

  if (!req.body || !req.body.email || !req.body.password) {
    throw new BadRequestError("Email and Password are required to login.");
  }

  const expireIn = (duration: any): number => {
    if (!duration || isNaN(duration) || duration <= 0 || duration > 60 * 60) {
      return config.auth.defaultDuration;
    }
    return duration;
  };

  const params: parameters = {
    email: req.body.email,
    password: req.body.password,
    expireInSeconds: expireIn(req.body.expireInSeconds),
  };

  const user = await getUserByEmail(params.email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const passwordMatch = await checkPasswordHash(params.password, user.password);
  if (!passwordMatch) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const token = makeJWT(user.id, params.expireInSeconds, config.auth.secret);

  respondWithJSON(res, 200, sanitizeUser(user, token));
}

function sanitizeUser(user: User, token: string = "") {
  const { password, ...safeUser } = user;
  return token == "" ? { ...safeUser } : { ...safeUser, token };
}
