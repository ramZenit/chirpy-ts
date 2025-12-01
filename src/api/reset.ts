import { cfg } from "../config.js";
import type { Request, Response } from "express";

export function handlerReset(req: Request, res: Response) {
  cfg.fileserverHits = 0;
  res.write("Metrics have been reset.");
  res.end();
}
