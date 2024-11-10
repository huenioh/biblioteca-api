import express from "express";
import {
  createEmprestimo,
  deleteEmprestimo,
  finalizarEmprestimo,
  getEmprestimos,
  updateEmprestimo
} from "../controllers/emprestimoController.js";

const router = express.Router();

router.post("/", createEmprestimo);
router.get("/", getEmprestimos);
router.put("/:id", updateEmprestimo);
router.put("/finalizar/:id", finalizarEmprestimo)
router.delete("/:id", deleteEmprestimo);


export default router;
