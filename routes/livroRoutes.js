import express from "express";
import {
  createLivro,
  getLivros,
  getLivroByNome,
  updateLivro,
  deleteLivro,
  getLivroByAutor,
  getLivroByGenero,
} from "../controllers/livrosController.js";

const router = express.Router();

router.post("/", createLivro);
router.get("/", getLivros);
router.get("/titulo/:titulo", getLivroByNome);
router.get("/autor/:autor", getLivroByAutor);
router.get("/genero/:genero", getLivroByGenero);
router.put("/:id", updateLivro);
router.delete("/:id", deleteLivro);

export default router;
