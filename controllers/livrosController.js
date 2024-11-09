import { createConnection } from "../db.js";
import livroSchema from "../validators/livrosValidator.js";

// Adicionar novo Livro
export const createLivro = async (req, res) => {
  try {
    // Validação com Zod
    const parsedData = livroSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ errors: parsedData.error.errors });
    }

    const { titulo, autor, genero, ano_publicacao } = req.body;

    // Obter a conexão com o banco de dados
    const connection = await createConnection();

    // Adicionar um novo livro no banco
    const [result] = await connection.execute(
      "INSERT INTO livros (titulo, autor, genero, ano_publicacao) VALUES (?, ?, ?, ?)",
      [titulo, autor, genero, ano_publicacao]
    );

    return res
      .status(201)
      .json({ message: "Livro adicionado com sucesso", id: result.insertId });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao adicionar livro", details: error.message });
  }
};

export const getLivros = async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM livros");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar os livros" });
  }
};

export const getLivroByNome = async (req, res) => {
  try {
    const { titulo } = req.params;
    const connection = await createConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM livros WHERE LOWER(titulo) LIKE LOWER(CONCAT('%', ?, '%'))",
      [titulo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar o Livro" });
  }
};

// fazer o getLivroByGenero, getLivroByAno, getLivroByAutor

export const updateLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, genero, ano_publicacao } = req.body;

    // Validação dos dados com Zod
    const parsedData = livroSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ errors: parsedData.error.errors });
    }

    const connection = await createConnection();
    const [result] = await connection.execute(
      "UPDATE livros SET titulo = ?, autor = ?, genero = ?, ano_publicacao = ? WHERE id = ?",
      [titulo, autor, genero, ano_publicacao, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    return res.status(200).json({ message: "Livro atualizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar o Livro" });
  }
};

export const deleteLivro = async (req, res) => {
  try {
    const { titulo } = req.params;
    const connection = await createConnection();
    const [result] = await connection.execute(
      "DELETE FROM livros WHERE titulo = ?",
      [titulo]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    return res.status(200).json({ message: "Livro deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar o Livro" });
  }
};
