// backend/src/models/users/user.service.ts

import User from "./user.model";
import bcrypt from "bcryptjs";
import { generateUserCode } from "../../utils/generateUserCode";

class UserService {

  async createUser(data: any, currentUser: any) {

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userCode = generateUserCode();

    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      userCode,
      roles: data.roles,
      organizationId: currentUser.organizationId,
    });

    return newUser;
  }
}

export default new UserService();