import express from "express";
import { createLivro, getLivros } from "../controllers/livrosController.js";

const router = express.Router();

router.post("/", createLivro);
router.get("/", getLivros);

export default router;
