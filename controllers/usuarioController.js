import { createConnection } from "../db.js";
import usuarioSchema from "../validators/usuariosValidator.js";

// Criar um novo usuário
export const createUser = async (req, res) => {
  try {
    // Validação com Zod
    const parsedData = usuarioSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ errors: parsedData.error.errors });
    }

    const { nome, endereco, email, telefone } = req.body;

    // Obter a conexão com o banco de dados
    const connection = await createConnection();

    // Inserir o novo usuário no banco
    const [result] = await connection.execute(
      "INSERT INTO usuarios (nome, endereco, email, telefone) VALUES (?, ?, ?, ?)",
      [nome, endereco, email, telefone]
    );

    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso", id: result.insertId });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao criar o usuário", details: error.message });
  }
};

// Obter todos os usuários
export const getUsers = async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM usuarios");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar os usuários" });
  }
};

// Obter um usuário pelo Email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const connection = await createConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar o usuário" });
  }
};

// Atualizar um usuário
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, endereco, email, telefone } = req.body;

    // Validação dos dados com Zod
    const parsedData = usuarioSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ errors: parsedData.error.errors });
    }

    const connection = await createConnection();
    const [result] = await connection.execute(
      "UPDATE usuarios SET nome = ?, endereco = ?, email = ?, telefone = ? WHERE id = ?",
      [nome, endereco, email, telefone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar o usuário" });
  }
};

// Deletar um usuário
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const connection = await createConnection();
    const [result] = await connection.execute(
      "DELETE FROM usuarios WHERE email = ?",
      [email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar o usuário" });
  }
};
