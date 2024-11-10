import express from "express";
import {
  createLivro,
  getLivros,
  updateLivro,
  deleteLivro,
  getLivroByAutor,
  getLivroByGenero,
  getLivroByTitulo,
} from "../controllers/livrosController.js";

const router = express.Router();

router.post("/", createLivro);
router.get("/", getLivros);
router.get("/titulo/:titulo", getLivroByTitulo);
router.get("/autor/:autor", getLivroByAutor);
router.get("/genero/:genero", getLivroByGenero);
router.put("/:id", updateLivro);
router.delete("/:id", deleteLivro);

export default router;
