import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors.js";

export function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  respondWithJSON(res, 200, { cleanedBody: profaneFilter(params.body) });
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
