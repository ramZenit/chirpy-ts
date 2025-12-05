import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../errors.js";
import type { Request } from "express";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(
  userID: string,
  expireIn: number,
  secret: string
): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: Payload = {
    iss: "chirpy-ts",
    sub: userID,
    iat: issuedAt,
    exp: issuedAt + expireIn,
  };
  return jwt.sign(payload, secret, { algorithm: "HS256" });
}

export function validateJWT(tokenSting: string, secret: string): string {
  try {
    const payload = jwt.verify(tokenSting, secret) as Payload;
    if (!payload.sub) {
      console.error("JWT verification error: missing subject");
      throw new UnauthorizedError("Invalid token: missing subject");
    }
    return payload.sub;
  } catch (error) {
    console.error("JWT verification error:", error);
    throw new UnauthorizedError("Invalid token");
  }
}

export function getBearerToken(req: Request): string {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid Authorization header");
  }
  return authHeader.slice(7).trim();
}
