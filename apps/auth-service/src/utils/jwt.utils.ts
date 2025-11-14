import jwt from "jsonwebtoken";
import { JWTPayload, UserRole } from "@quizhub/shared";

const JWT_SECRET = (process.env.JWT_SECRET || "default-secret") as string;
const JWT_REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET ||
  "default-refresh-secret") as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "15m") as string;
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN ||
  "7d") as string;

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions) as string;
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions) as string;
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
};

export const generateTokenPair = (
  userId: string,
  email: string,
  role: UserRole
) => {
  const payload: JWTPayload = {
    userId,
    email,
    role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
