import bcrypt from "bcrypt";
import prisma from "../config/prisma";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export async function createUser(data: CreateUserData) {
  const { name, email, password, role = "BARBER" } = data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("E-mail já cadastrado.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
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

  return user;
}
