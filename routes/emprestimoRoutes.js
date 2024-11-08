import express from "express";
import {
  createEmprestimo,
  getEmprestimos,
} from "../controllers/emprestimoController.js";

const router = express.Router();

router.post("/", createEmprestimo);
router.get("/", getEmprestimos);


export default router;
