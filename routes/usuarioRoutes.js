import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:email", getUserByEmail);
router.put("/:id", updateUser);
router.delete("/:email", deleteUser);

export default router;
