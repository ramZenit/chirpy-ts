import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors.js";
import { createChirp } from "../db/queries/chirps.js";

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
    userId: string;
  };

  const params: parameters = req.body;

  if (!params.body || !params.userId) {
    throw new BadRequestError(
      "Email and UserID are required to create a chirp."
    );
  }

  params.body = validateChirp(params.body);
  const chirp = await createChirp({
    body: params.body,
    userId: params.userId,
  });

  if (!chirp) {
    throw new Error("Failed to create chirp.");
  }

  respondWithJSON(res, 201, chirp);
}
