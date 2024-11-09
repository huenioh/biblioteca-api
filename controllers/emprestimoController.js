import { createConnection } from "../db.js";

export const createEmprestimo = async (req, res) => {
  try {
    const { usuario_id, livro_id, data_emprestimo, data_devolucao } = req.body;

    const connection = await createConnection();

    const [livro] = await connection.execute(
      "SELECT emprestado FROM livros WHERE id = ?",
      [livro_id]
    );

    if (livro.length === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    if (livro[0].emprestado === 1) {
      return res.status(400).json({ error: "Livro já está emprestado" });
    }

    const [result] = await connection.execute(
      "INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, data_devolucao) VALUES (?, ?, ?, ?)",
      [usuario_id, livro_id, data_emprestimo, data_devolucao]
    );

    await connection.execute(
      "UPDATE livros SET emprestado = 1 WHERE id = ?",
      [livro_id]
    );

    return res
      .status(201)
      .json({ message: "Empréstimo criado com sucesso", id: result.insertId });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao criar empréstimo", details: error.message });
  }
};


export const getEmprestimos = async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM emprestimos");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar os emprestimos" });
  }
};

export const updateEmprestimo = async (req, res) => {
  res.send('updateEmprestimo');
};



export const deleteEmprestimo = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();

    const [emprestimo] = await connection.execute(
      "SELECT livro_id FROM emprestimos WHERE id = ?",
      [id]
    );

    if (emprestimo.length === 0) {
      return res.status(404).json({ error: "Empréstimo não encontrado" });
    }

    const livro_id = emprestimo[0].livro_id;

    await connection.execute(
      "UPDATE livros SET emprestado = 0 WHERE id = ?",
      [livro_id]
    );

    const [result] = await connection.execute(
      "DELETE FROM emprestimos WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Empréstimo não encontrado" });
    }

    return res.status(200).json({ message: "Empréstimo deletado com sucesso e status do livro atualizado" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar o empréstimo", details: error.message });
  }
};





//await connection.query(`
//  CREATE TABLE IF NOT EXISTS emprestimos (
//    id INT AUTO_INCREMENT PRIMARY KEY,
//    usuario_id INT,
//    livro_id INT,
//    data_emprestimo DATE,
//    data_devolucao DATE,
//    devolvido BOOLEAN DEFAULT FALSE,
//    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
//    FOREIGN KEY (livro_id) REFERENCES livros(id)
//  );
//`);