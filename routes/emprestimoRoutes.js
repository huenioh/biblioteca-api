import express from "express";
import {
  createEmprestimo,
  deleteEmprestimo,
  getEmprestimos,
} from "../controllers/emprestimoController.js";

const router = express.Router();

router.post("/", createEmprestimo);
router.get("/", getEmprestimos);
router.delete("/:id", deleteEmprestimo);


export default router;
