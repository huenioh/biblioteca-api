import express from "express";
import { createLivro, getLivros, getLivroByNome, updateLivro, deleteLivro } from "../controllers/livrosController.js";

const router = express.Router();

router.post("/", createLivro);
router.get("/", getLivros);
router.get("/:titulo", getLivroByNome)
router.put("/:id", updateLivro);
router.delete("/:titulo", deleteLivro);

export default router;
