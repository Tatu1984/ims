import { findByEmail, updateLastLogin } from "@/backend/repositories/user.repository";
import { comparePassword } from "@/backend/utils/hash.util";
import { signToken } from "@/backend/utils/jwt.util";
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

  const token = await signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return {
    token,
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
