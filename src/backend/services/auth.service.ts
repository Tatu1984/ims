import { findByEmail, findById, updateLastLogin } from "@/backend/repositories/user.repository";
import { comparePassword } from "@/backend/utils/hash.util";
import { signToken, signRefreshToken } from "@/backend/utils/jwt.util";
import { AppError } from "@/backend/utils/error-handler.util";

export async function login(email: string, password: string) {
  const user = await findByEmail(email);
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  if (user.status === "Inactive") {
    throw new AppError(403, "Account is deactivated");
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  await updateLastLogin(user.id);

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const [token, refreshToken] = await Promise.all([
    signToken(payload),
    signRefreshToken(payload),
  ]);

  return {
    token,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      initials: user.initials,
    },
  };
}

export async function refreshSession(userId: string) {
  const user = await findById(userId);
  if (!user || user.status === "Inactive") {
    throw new AppError(401, "Invalid refresh token");
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const [token, refreshToken] = await Promise.all([
    signToken(payload),
    signRefreshToken(payload),
  ]);

  return { token, refreshToken, user: payload };
}
