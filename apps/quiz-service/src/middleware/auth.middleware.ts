import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { UnauthorizedError } from "@quizhub/shared";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.substring(7);
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || "http://localhost:3001";

    // Validate token with auth service
    const response = await axios.get(`${authServiceUrl}/api/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && response.data.data.user) {
      req.user = response.data.data.user;
      next();
    } else {
      throw new UnauthorizedError("Invalid token");
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      next(new UnauthorizedError("Invalid or expired token"));
    } else {
      next(error);
    }
  }
};
