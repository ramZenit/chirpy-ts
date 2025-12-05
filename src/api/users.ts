import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError, UnauthorizedError } from "../errors.js";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { hashPassword } from "../auth/hash.js";
import type { User } from "../db/schema.js";
import { checkPasswordHash } from "../auth/hash.js";
import { config } from "../config.js";
import { makeJWT } from "../auth/jwt.js";
import {
  makeRefreshToken,
  checkRefreshToken,
  revokeRefeshToken,
} from "../auth/refresh_tokens.js";
import { getBearerToken } from "../auth/jwt.js";

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
  };

  if (!req.body || !req.body.email || !req.body.password) {
    throw new BadRequestError("Email and Password are required to login.");
  }

  const params: parameters = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = await getUserByEmail(params.email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const passwordMatch = await checkPasswordHash(params.password, user.password);
  if (!passwordMatch) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const token = makeJWT(
    user.id,
    config.auth.defaultDuration,
    config.auth.secret
  );
  const refreshToken = await makeRefreshToken(user.id);

  respondWithJSON(res, 200, {
    ...sanitizeUser(user),
    token: token,
    refreshToken: refreshToken,
  });
}

export async function handlerRefreshToken(req: Request, res: Response) {
  const token = getBearerToken(req);
  const refreshToken = await checkRefreshToken(token);

  const newJwtToken = makeJWT(
    refreshToken.userId,
    config.auth.defaultDuration,
    config.auth.secret
  );

  respondWithJSON(res, 200, { token: newJwtToken });
}

export async function handlerRevokeRefreshToken(req: Request, res: Response) {
  const token = getBearerToken(req);
  await revokeRefeshToken(token);

  respondWithJSON(res, 204, {});
}

function sanitizeUser(user: User) {
  const { password, ...safeUser } = user;
  return safeUser;
}
