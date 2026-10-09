
import { Request, Response } from "express";
import { createUser } from "../services/userService";

export async function createUserController(
  req: Request,
  res: Response
) {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        mensagem: "Nome, e-mail e senha são obrigatórios.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length < 2) {
      return res.status(400).json({
        mensagem: "O nome deve ter pelo menos 2 caracteres.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        mensagem: "Informe um e-mail válido.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        mensagem: "A senha deve ter pelo menos 8 caracteres.",
      });
    }

    const user = await createUser({
      name: normalizedName,
      email: normalizedEmail,
      password,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "E-mail já cadastrado."
    ) {
      return res.status(409).json({
        mensagem: error.message,
      });
    }

    return res.status(500).json({
      mensagem: "Não foi possível criar o usuário.",
    });
  }
}