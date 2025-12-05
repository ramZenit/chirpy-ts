import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./jwt.js";
import { hashPassword, checkPasswordHash } from "./hash.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT Creation and Validation", () => {
  const secret = "supersecretkey";
  const userID = "user123";
  const expireIn = 60 * 60; // 1 hour
  let token: string;

  beforeAll(() => {
    token = makeJWT(userID, expireIn, secret);
  });

  it("should create and validate a JWT successfully", () => {
    const validatedUserID = validateJWT(token, secret);
    expect(validatedUserID).toBe(userID);
  });

  it("should throw an error for an invalid JWT", () => {
    const invalidToken = "invalid.token.string";
    expect(() => validateJWT(invalidToken, secret)).toThrow("Invalid token");
  });

  it("should throw an error for an expired JWT", () => {
    const shortLivedToken = makeJWT(userID, 1, secret); // 1 second expiry
    // Wait for 2 seconds to ensure the token is expired
    return new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
      expect(() => validateJWT(shortLivedToken, secret)).toThrow(
        "Invalid token"
      );
    });
  });
});
