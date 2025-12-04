import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "grouptherapy-default-secret-change-in-production";
const JWT_EXPIRES_IN = "24h";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const ATTEMPT_WINDOW_MINUTES = 15;

interface JWTPayload {
  username: string;
  iat?: number;
  exp?: number;
}

export function generateToken(username: string): string {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function createSession(username: string): string {
  return generateToken(username);
}

export function validateSession(token: string): string | null {
  const payload = verifyToken(token);
  return payload?.username || null;
}

export function deleteSession(_token: string): void {
}

export async function isRateLimited(username: string): Promise<boolean> {
  try {
    const recentAttempts = await storage.getRecentLoginAttempts(
      username,
      ATTEMPT_WINDOW_MINUTES
    );
    
    const failedAttempts = recentAttempts.filter(attempt => !attempt.successful);
    return failedAttempts.length >= MAX_LOGIN_ATTEMPTS;
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return false;
  }
}

export async function validateCredentials(
  username: string,
  password: string,
  ipAddress?: string
): Promise<{ valid: boolean; message?: string }> {
  try {
    if (await isRateLimited(username)) {
      await storage.recordLoginAttempt({
        username,
        ipAddress,
        successful: false,
      });
      return {
        valid: false,
        message: `Too many failed login attempts. Please try again in ${LOCKOUT_DURATION_MINUTES} minutes.`,
      };
    }

    const adminUser = await storage.getAdminUserByUsername(username);
    
    if (!adminUser) {
      await storage.recordLoginAttempt({
        username,
        ipAddress,
        successful: false,
      });
      return { valid: false, message: "Invalid credentials" };
    }

    if (!adminUser.isActive) {
      await storage.recordLoginAttempt({
        username,
        ipAddress,
        successful: false,
      });
      return { valid: false, message: "Account is inactive" };
    }

    const isValid = await bcrypt.compare(password, adminUser.passwordHash);
    
    await storage.recordLoginAttempt({
      username,
      ipAddress,
      successful: isValid,
    });

    if (isValid) {
      await storage.updateAdminLastLogin(username);
      return { valid: true };
    }

    return { valid: false, message: "Invalid credentials" };
  } catch (error) {
    console.error("Credential validation error:", error);
    return { valid: false, message: "Authentication service error" };
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const username = validateSession(token);
  if (!username) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
  
  (req as any).user = { username };
  next();
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  return bcrypt.hash(password, saltRounds);
}
