import { Request, Response } from "express";
import { createUser } from "../services/userService";

export async function createUserController(
  req: Request,
  res: Response
) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        mensagem: "Nome, e-mail e senha são obrigatórios.",
      });
    }

    const user = await createUser({
      name,
      email,
      password,
      role,
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
