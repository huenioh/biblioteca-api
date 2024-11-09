import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let connection;

async function createConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
  }
  return connection;
}

async function initializeDatabase() {
  try {
    // Cria a conexão
    const connection = await createConnection();

    // Tenta estabelecer a conexão com o banco de dados
    console.log("Conexão com o MySQL estabelecida com sucesso.");

    // Criação do banco de dados se não existir
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    console.log(
      `Banco de dados "${process.env.DB_NAME}" verificado/criado com sucesso`
    );

    // Muda para o banco de dados criado
    await connection.changeUser({ database: process.env.DB_NAME });

    // Criação das tabelas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS livros (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        autor VARCHAR(255) NOT NULL,
        genero VARCHAR(100) NOT NULL,
        ano_publicacao YEAR NOT NULL
      );
    `);

    // Lembrar q o mysql year só aceita anos entre 1901 e 2155.

    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        endereco VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(15) NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS emprestimos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        livro_id INT,
        data_emprestimo DATE,
        data_devolucao DATE,
        devolvido BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (livro_id) REFERENCES livros(id)
      );
    `);

    console.log("Tabelas verificadas/criadas com sucesso.");
  } catch (error) {
    console.error("Erro na inicialização da base de dados:", error);
  }
}

export { initializeDatabase, createConnection };
