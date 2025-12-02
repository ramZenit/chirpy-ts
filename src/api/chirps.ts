import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
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
