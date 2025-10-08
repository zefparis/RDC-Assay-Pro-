import * as dotenv from "dotenv";
import { z } from "zod";

// Load environment variables
dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().default(""),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  CORS_ORIGIN: z.string().default("*"),
  MAX_FILE_SIZE: z.string().default("10485760"),
  UPLOAD_PATH: z.string().default("./uploads"),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.string().default("587"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().default("noreply@rdcassay.africa"),
  FROM_NAME: z.string().default("RDC Assay Pro"),
  RATE_LIMIT_WINDOW_MS: z.string().default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().default("100"),
  LOG_LEVEL: z.string().default("info"),
  LOG_FILE: z.string().default("./logs/app.log"),
  API_DOCS_ENABLED: z.string().default("true"),
  BCRYPT_ROUNDS: z.string().default("12"),
  SESSION_SECRET: z.string().default("your-session-secret"),
  CERTIFICATION_API_URL: z.string().optional(),
  CERTIFICATION_API_KEY: z.string().optional(),
  DEMO_LOGIN_ENABLED: z.string().default("true"),
});

export const env = EnvSchema.parse(process.env);

// Export structured config for backward compatibility
export const config = {
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENV,
  database: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET || env.JWT_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  cors: {
    origin: env.CORS_ORIGIN,
  },
  upload: {
    maxFileSize: parseInt(env.MAX_FILE_SIZE, 10),
    path: env.UPLOAD_PATH,
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'text/csv'] as const,
  },
  email: {
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT, 10),
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
    from: {
      email: env.FROM_EMAIL,
      name: env.FROM_NAME,
    },
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  logging: {
    level: env.LOG_LEVEL,
    file: env.LOG_FILE,
  },
  api: {
    docsEnabled: env.API_DOCS_ENABLED === 'true' || env.NODE_ENV === 'development',
  },
  security: {
    bcryptRounds: parseInt(env.BCRYPT_ROUNDS, 10),
    sessionSecret: env.SESSION_SECRET,
  },
  external: {
    certificationApiUrl: env.CERTIFICATION_API_URL || '',
    certificationApiKey: env.CERTIFICATION_API_KEY || '',
  },
  features: {
    demoLoginEnabled: env.DEMO_LOGIN_ENABLED === 'true',
  },
} as const;
