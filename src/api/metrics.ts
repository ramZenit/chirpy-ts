import { cfg } from "../config.js";
import type { Request, Response } from "express";

export function handlerMetrics(_: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`Hits: ${cfg.fileserverHits}`);
}
