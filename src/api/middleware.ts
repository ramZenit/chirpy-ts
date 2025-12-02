import type { Request, Response, NextFunction } from "express";
import { cfg } from "../config.js";
import { respondWithError } from "./json.js";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "../errors.js";

export function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on("finish", () => {
    const statusCode = res.statusCode;

    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });

  next();
}

export function middlewareMetricsInc(
  _: Request,
  __: Response,
  next: NextFunction
) {
  cfg.fileserverHits++;

  next();
}

export function errorMiddleware(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) {
  console.log("error: ", err.message);

  switch (true) {
    case err instanceof BadRequestError:
      respondWithError(res, 400, err.message);
      break;
    case err instanceof UnauthorizedError:
      respondWithError(res, 401, "Unauthorized");
      break;
    case err instanceof ForbiddenError:
      respondWithError(res, 403, "Forbidden");
      break;
    case err instanceof NotFoundError:
      respondWithError(res, 404, "Not Found");
      break;
    default:
      respondWithError(res, 500, "Something went wrong on our end");
  }
}
