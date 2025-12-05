import type { Request, Response } from "express";
import { config } from "../config.js";
import { respondWithJSON } from "./json.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors.js";
import {
  createChirp,
  getAllChirp,
  getChirpById,
} from "../db/queries/chirps.js";
import { getUserByID } from "../db/queries/users.js";
import { getBearerToken, validateJWT } from "../auth/jwt.js";

function validateChirp(body: string): string {
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }
  return profaneFilter(body);
}

function profaneFilter(text: string): string {
  const badWords = ["kerfuffle", "sharbert", "fornax"];
  const parts = text.split(" ");
  let result = [];
  for (const word of parts)
    if (badWords.includes(word.toLowerCase())) {
      let stars = "*".repeat(4);
      result.push(stars);
    } else {
      result.push(word);
    }
  return result.join(" ");
}

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };
  if (!req.body || !req.body.body) {
    throw new BadRequestError("Body is required to create a chirp.");
  }
  const params: parameters = {
    body: validateChirp(req.body.body),
  };

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.auth.secret);
  const user = await getUserByID(userId);
  if (!user) {
    throw new UnauthorizedError("Invalid token: user not found");
  }

  const chirp = await createChirp({
    body: params.body,
    userId: user.id,
  });
  if (!chirp) {
    throw new Error("Failed to create chirp.");
  }

  respondWithJSON(res, 201, chirp);
}

export async function handlerGetAllChirps(req: Request, res: Response) {
  const chirps = await getAllChirp();

  if (!chirps.length) {
    respondWithJSON(res, 204, {});
    return;
  }

  respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirpById(req: Request, res: Response) {
  type parameters = {
    chripId: string;
  };

  const urlParans = req.params;
  if (!urlParans || !urlParans.chirpID) {
    throw new BadRequestError("Chirp ID is required to get a chirp.");
  }

  const params: parameters = {
    chripId: urlParans.chirpID,
  };

  const chirp = await getChirpById(params.chripId);
  if (!chirp) {
    throw new NotFoundError("Chirp not found.");
  }

  respondWithJSON(res, 200, chirp);
}
