
# Projeto Backend em Node.js

## Descrição

Este projeto é um sistema backend desenvolvido em Node.js com Express para gerenciar uma biblioteca. Ele inclui funcionalidades como CRUD de usuários e livros, controle de empréstimos e geração de relatórios.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para criação de APIs.
- **MySQL2**: Biblioteca para interação com o banco de dados MySQL.
- **Zod**: Biblioteca para validação de dados.
- **ExcelJS**: Utilizado para geração de relatórios em Excel.
- **dotenv**: Gerenciamento de variáveis de ambiente.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- Node.js (versão >= 16)
- MySQL (versão >= 8)
- npm ou yarn

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/huenioh/biblioteca-api
   cd seu-repositorio
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```env
   DB_HOST=seu-host
   DB_USER=seu-usuario
   DB_PASSWORD=sua-senha
   DB_DATABASE=seu-banco
   PORT=3000
   ```

## Uso

Inicie o servidor:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`.

## Funcionalidades

  - CRUD de usuários e livros
  - Controle de empréstimos e devoluções
  - Geração de relatórios em PDF e Excel

## Estrutura do Projeto

```plaintext
src/
├── controllers/    # Lógica das rotas
├── routes/         # Definição das rotas da API
├── validators/     # Validações com Zod
├── app.js          # Configuração do servidor
└── db.js           # configuração do bando de dados
```

## Scripts Disponíveis

- `npm start`: Inicia o servidor.