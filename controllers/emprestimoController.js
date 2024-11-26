import { createConnection } from "../db.js";

export const createEmprestimo = async (req, res) => {
  try {
    const { usuario_id, livro_id, data_emprestimo, data_devolucao } = req.body;
    const connection = await createConnection();

    const [livro] = await connection.execute(
      "SELECT estoque, vezes_emprestado, emprestimos_ativos FROM livros WHERE id = ?",
      [livro_id]
    );

    if (livro.length === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }

    if (livro[0].estoque <= 0) {
      return res.status(400).json({ error: "Livro sem estoque disponível" });
    }

    const [usuario] = await connection.execute(
      "SELECT emprestimo_ativo, quantidade_emprestimos FROM usuarios WHERE id = ?",
      [usuario_id]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (usuario[0].emprestimo_ativo === 1) {
      return res.status(400).json({ error: "Usuário já possui um empréstimo ativo" });
    }

    const [result] = await connection.execute(
      "INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, data_devolucao) VALUES (?, ?, ?, ?)",
      [usuario_id, livro_id, data_emprestimo, data_devolucao]
    );

    await connection.execute(
      `UPDATE livros 
       SET estoque = estoque - 1, 
           vezes_emprestado = vezes_emprestado + 1, 
           emprestimos_ativos = emprestimos_ativos + 1 
       WHERE id = ?`,
      [livro_id]
    );

    await connection.execute(
      `UPDATE usuarios 
       SET emprestimo_ativo = 1, 
           quantidade_emprestimos = quantidade_emprestimos + 1 
       WHERE id = ?`,
      [usuario_id]
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
  try {
    const { id } = req.params;
    const { data_devolucao } = req.body;
    const connection = await createConnection();

    const [emprestimo] = await connection.execute(
      "SELECT * FROM emprestimos WHERE id = ?",
      [id]
    );

    if (emprestimo.length === 0) {
      return res.status(404).json({ error: "Empréstimo não encontrado" });
    }

    const { devolvido } = emprestimo[0];

    if (devolvido) {
      return res.status(400).json({ error: "Empréstimo já finalizado" });
    }

    const [result] = await connection.execute(
      "UPDATE emprestimos SET data_devolucao = ? WHERE id = ?",
      [data_devolucao, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Erro ao atualizar o empréstimo" });
    }

    return res.status(200).json({
      message: "Empréstimo atualizado com sucesso",
      id,
      updatedFields: { data_devolucao },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao atualizar o empréstimo", details: error.message });
  }
};


export const deleteEmprestimo = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();

    const [emprestimo] = await connection.execute(
      "SELECT usuario_id, livro_id FROM emprestimos WHERE id = ?",
      [id]
    );

    if (emprestimo.length === 0) {
      return res.status(404).json({ error: "Empréstimo não encontrado" });
    }

    const { usuario_id, livro_id } = emprestimo[0];

    await connection.execute(
      `UPDATE livros 
       SET emprestimos_ativos = emprestimos_ativos - 1, 
           estoque = estoque + 1 
       WHERE id = ?`,
      [livro_id]
    );

    await connection.execute(
      `UPDATE usuarios 
       SET emprestimo_ativo = 0
       WHERE id = ?`,
      [usuario_id]
    );

    const [result] = await connection.execute(
      "DELETE FROM emprestimos WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Empréstimo não encontrado" });
    }

    return res.status(200).json({ message: "Empréstimo deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar o empréstimo", details: error.message });
  }
};


export const finalizarEmprestimo = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();

    const [emprestimo] = await connection.execute(
      "SELECT usuario_id, livro_id, devolvido FROM emprestimos WHERE id = ?",
      [id]
    );

    if (emprestimo.length === 0) {
      return res.status(404).json({ error: "Empréstimo não encontrado" });
    }

    const { usuario_id, livro_id, devolvido } = emprestimo[0];

    if (devolvido) {
      return res.status(400).json({ error: "Empréstimo já marcado como devolvido" });
    }

    await connection.execute(
      `UPDATE livros 
       SET estoque = estoque + 1, 
           emprestimos_ativos = emprestimos_ativos - 1 
       WHERE id = ?`,
      [livro_id]
    );

    await connection.execute(
      `UPDATE usuarios 
       SET emprestimo_ativo = 0 
       WHERE id = ?`,
      [usuario_id]
    );

    const [result] = await connection.execute(
      "UPDATE emprestimos SET devolvido = 1 WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Empréstimo não encontrado" });
    }

    return res.status(200).json({ message: "Empréstimo atualizado como devolvido com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar o empréstimo", details: error.message });
  }
};
