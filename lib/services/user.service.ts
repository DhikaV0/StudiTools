import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { UserRepository } from "@/lib/repositories/user.repository";

export class UserService {
  static async getAllUsers() {
    return UserRepository.findAll();
  }

  static async createUser(data: {
    name: string;
    username: string;
    password: string;
    role: Role;
  }) {
    const existing = await UserRepository.findByUsername(data.username);
    if (existing) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return UserRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  static async deleteUser(id: string) {
    return UserRepository.delete(id);
  }
}