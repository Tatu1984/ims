import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return new TextEncoder().encode(secret);
}

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function signToken(
  payload: JwtPayload,
  expiresIn?: string
): Promise<string> {
  const ttl = expiresIn || process.env.JWT_EXPIRES_IN || "1h";
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(getSecret());
}

export async function signRefreshToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ id: payload.id, type: "refresh" } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<{ id: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "refresh") return null;
    return { id: payload.id as string };
  } catch {
    return null;
  }
}
