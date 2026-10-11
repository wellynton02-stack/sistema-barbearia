
import { Request, Response } from "express";
import { loginUser } from "../services/authService";

export async function loginController(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        mensagem: "E-mail e senha são obrigatórios.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await loginUser(
      normalizedEmail,
      password
    );

    if (!result) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos.",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erro no login:", error);

    return res.status(500).json({
      mensagem: "Não foi possível realizar o login.",
    });
  }
}