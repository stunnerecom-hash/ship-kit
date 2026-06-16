import jwt from "jsonwebtoken";

const SECRET  = process.env.JWT_SECRET!;
const EXPIRES = process.env.JWT_EXPIRES_IN ?? "30d";

export interface TokenPayload {
  userId: string;
  email:  string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET) as TokenPayload;
}
