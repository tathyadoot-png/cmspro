// backend/src/models/auth/auth.service.ts

import User from "../users/user.model";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt";

class AuthService {

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new Error("Invalid credentials");

    // Check lock
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new Error("Account locked. Try later.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.failedAttempts += 1;

      if (user.failedAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
        user.failedAttempts = 0;
      }

      await user.save();
      throw new Error("Invalid credentials");
    }

    user.failedAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const payload = {
      id: user._id,
      organizationId: user.organizationId,
      roles: user.roles,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, user };
  }
}

export default new AuthService();