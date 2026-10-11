import bcrypt from "bcrypt";
import prisma from "../config/prisma";

type UserRole = "CLIENT" | "BARBER";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export async function createUser(data: CreateUserData) {
  const { name, email, password, role = "CLIENT" } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("E-mail já cadastrado.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
