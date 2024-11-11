import express from "express";
import {
  relatorioEmprestimosPendentes,
  relatorioEmprestimosAtivos,
  relatorioLivrosMaisEmprestados,
} from "../controllers/relatorioController.js";

const router = express.Router();

router.get("/emprestimos-pendentes", relatorioEmprestimosPendentes);
router.get("/emprestimos-ativos", relatorioEmprestimosAtivos);
router.get("/livros-mais-emprestados",relatorioLivrosMaisEmprestados);

export default router;
