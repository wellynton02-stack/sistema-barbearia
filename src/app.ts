import express from "express";
import prisma from "./config/prisma";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API do Sistema da Barbearia funcionando!",
  });
});

app.get("/teste-banco", async (req, res) => {
  try {
    const totalUsuarios = await prisma.user.count();

    res.json({
      banco: "conectado",
      usuarios: totalUsuarios,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      banco: "erro",
      mensagem: "Nao foi possivel consultar o banco de dados.",
    });
  }
});

app.use("/usuarios", userRoutes);

export default app;
