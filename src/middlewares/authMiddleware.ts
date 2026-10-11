import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      mensagem: "Token de autenticação não informado.",
    });
  }

  const token = authorization.slice(7);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET não configurada.");

    return res.status(500).json({
      mensagem: "Erro de configuração da autenticação.",
    });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string"
    ) {
      return res.status(401).json({
        mensagem: "Token inválido.",
      });
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    return next();
  } catch {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}

export function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      mensagem: "Acesso permitido somente para administradores.",
    });
  }

  return next();
}
