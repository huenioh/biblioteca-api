import ExcelJS from "exceljs";
import { createConnection } from "../db.js";

async function planiliaEstilizada(data, sheetName, headers) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = headers.map(header => ({
    header: header.displayName,
    key: header.key,
    width: 25,
  }));

  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E79' },
  };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  data.forEach(row => {
    const rowData = worksheet.addRow(row);
    rowData.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
    });
  });

  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const cellLength = cell.value ? cell.value.toString().length : 10;
      if (cellLength > maxLength) {
        maxLength = cellLength;
      }
    });
    column.width = maxLength < 15 ? 15 : maxLength;
  });

  return workbook;
}

export const relatorioEmprestimosPendentes = async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.query(`
      SELECT u.nome, u.email, e.data_emprestimo AS dataEmprestimo, e.data_devolucao AS dataDevolucao, l.titulo
      FROM emprestimos e
      JOIN usuarios u ON e.usuario_id = u.id
      JOIN livros l ON e.livro_id = l.id
      WHERE e.devolvido = FALSE;
    `);

    const headers = [
      { displayName: 'Nome', key: 'nome' },
      { displayName: 'Email', key: 'email' },
      { displayName: 'Data Emprestimo', key: 'dataEmprestimo' },
      { displayName: 'Data Devolucao', key: 'dataDevolucao' },
      { displayName: 'Título', key: 'titulo' },
    ];

    const workbook = await planiliaEstilizada(rows, 'Empréstimos Pendentes', headers);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=emprestimos_pendentes.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erro ao gerar relatório de empréstimos pendentes:', error);
    res.status(500).send('Erro ao gerar relatório de empréstimos pendentes');
  }
};

export const relatorioEmprestimosAtivos = async (req, res) => {
  try {
    const connection = await createConnection();

    const [rows] = await connection.query(`
      SELECT u.nome, l.titulo, e.data_emprestimo, e.data_devolucao
      FROM emprestimos e
      JOIN usuarios u ON e.usuario_id = u.id
      JOIN livros l ON e.livro_id = l.id
      WHERE e.devolvido = FALSE;
    `);

    const headers = [
      { displayName: 'Nome do Usuário', key: 'nome' },
      { displayName: 'Título do Livro', key: 'titulo' },
      { displayName: 'Data de Empréstimo', key: 'data_emprestimo' },
      { displayName: 'Data de Devolução', key: 'data_devolucao' },
    ];

    const workbook = await planiliaEstilizada(rows, 'Empréstimos Ativos', headers);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=emprestimos_ativos.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erro ao gerar relatório de empréstimos ativos:', error);
    res.status(500).send('Erro ao gerar relatório de empréstimos ativos');
  }
};

export const relatorioLivrosMaisEmprestados = async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.query(`
      SELECT l.titulo, l.autor, l.vezes_emprestado AS vezesEmprestado
      FROM livros l
      ORDER BY l.vezes_emprestado DESC
      LIMIT 10;
    `);

    const headers = [
      { displayName: 'Título', key: 'titulo' },
      { displayName: 'Autor', key: 'autor' },
      { displayName: 'Vezes Emprestado', key: 'vezesEmprestado' },
    ];

    const workbook = await planiliaEstilizada(rows, 'Livros Mais Emprestados', headers);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=livros_mais_emprestados.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erro ao gerar relatório de livros mais emprestados:', error);
    res.status(500).send('Erro ao gerar relatório de livros mais emprestados');
  }
};
