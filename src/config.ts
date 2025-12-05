import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBConfig;
  auth: JWTConfig;
};

type JWTConfig = {
  secret: string;
  defaultDuration: number;
  issuer: string;
};

type APIConfig = {
  platform: string;
  port: number;
  fileserverHits: number;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
  auth: {
    secret: envOrThrow("JWT_SECRET"),
    defaultDuration: 60 * 60, // 1 hour;
    issuer: "chirpy-ts",
  },
  api: {
    platform: envOrThrow("PLATFORM"),
    fileserverHits: 0,
    port: Number(envOrThrow("PORT")),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};
