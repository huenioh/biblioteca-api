import express from "express";
import { initializeDatabase } from "./db.js";
import livrosRoutes from "./routes/livroRoutes.js";
import usuariosRoutes from "./routes/usuarioRoutes.js";
import emprestimosRoutes from "./routes/emprestimoRoutes.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(express.json());

initializeDatabase();

app.use("/livros", livrosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/emprestimos", emprestimosRoutes);

const PORT = process.env.PORT || 3000;
const HOST = process.env.DB_HOST || "localhost";
app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
