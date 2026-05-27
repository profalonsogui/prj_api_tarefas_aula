# API de Tarefas (PBE)

Aplicação de gerenciamento de tarefas desenvolvida para a disciplina **PBE** (Programação Back-End). O projeto expõe uma **API REST** em Node.js/Express com persistência em **MySQL** e um **front-end estático** em HTML, CSS e JavaScript que consome a API.

## Funcionalidades

- Cadastrar, listar, atualizar e remover tarefas
- Atualização parcial de tarefas (ex.: alterar apenas o `status`)
- Interface web simples para criar tarefas, marcar como concluída e excluir
- Containerização com Docker e Docker Compose
- Pipeline de CI no GitHub Actions

## Tecnologias

| Camada      | Tecnologia                          |
|-------------|-------------------------------------|
| Backend     | Node.js 20, Express 5, mysql2       |
| Banco       | MySQL 8                             |
| Frontend    | HTML, CSS, JavaScript (fetch API)   |
| DevOps      | Docker, Docker Compose, GitHub Actions |

## Estrutura do projeto

```
prj_api_tarefas_aula/
├── backend/
│   └── src/
│       ├── server.js      # API REST e rotas
│       └── database.js    # Conexão com MySQL
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/script.js       # Consumo da API
├── docs/                  # Documentação da disciplina
├── .github/workflows/     # CI (build Docker)
├── docker-compose.yaml
├── Dockerfile
├── package.json
└── README.md
```

## Pré-requisitos

Escolha **uma** das formas de execução abaixo.

### Opção A — Docker (recomendado)

- [Docker](https://www.docker.com/) e Docker Compose instalados

### Opção B — Desenvolvimento local

- [Node.js](https://nodejs.org/) 20 ou superior
- [MySQL](https://www.mysql.com/) 8 (local ou apenas o container do banco via Docker)
- Ajuste da conexão em `backend/src/database.js` (veja [Desenvolvimento local](#desenvolvimento-local))

---

## Instalação e execução com Docker

Esta é a forma mais simples: sobe a API e o MySQL juntos, já com a rede interna configurada.

1. **Clone o repositório**

   ```bash
   git clone git@github-professor:profalonsogui/prj_api_tarefas_aula.git
   cd prj_api_tarefas_aula
   ```

2. **Crie a tabela no banco** (primeira execução)

   Suba apenas o MySQL, execute o SQL e depois suba tudo:

   ```bash
   docker compose up -d mysql
   ```

   Conecte ao MySQL (porta **3307** no host) e execute:

   ```sql
   CREATE DATABASE IF NOT EXISTS prj_apitarefas;

   USE prj_apitarefas;

   CREATE TABLE IF NOT EXISTS tarefas (
     id INT AUTO_INCREMENT PRIMARY KEY,
     titulo VARCHAR(255) NOT NULL,
     descricao TEXT,
     status VARCHAR(50) DEFAULT 'pendente'
   );
   ```

   Credenciais padrão do Compose: usuário `root`, senha `root`, banco `prj_apitarefas`.

3. **Suba API + MySQL**

   ```bash
   docker compose up --build
   ```

4. **Verifique a API**

   - Navegador ou cliente HTTP: [http://localhost:3001](http://localhost:3001)
   - Resposta esperada: `{"message":"API de Tarefas com MySQL funcionando!"}`

5. **Pare os containers**

   ```bash
   docker compose down
   ```

### Portas (Docker)

| Serviço | Porta no host | Descrição        |
|---------|---------------|------------------|
| API     | 3001          | Backend Express  |
| MySQL   | 3307          | Banco (mapeado de 3306 no container) |

> A conexão em `backend/src/database.js` usa o host `mysql` (nome do serviço no Compose). Isso funciona **dentro** da rede Docker; para rodar só o Node na máquina, veja a seção local abaixo.

---

## Desenvolvimento local

### 1. Instalar dependências

Na raiz do projeto:

```bash
npm install
```

### 2. Banco de dados

Crie o banco e a tabela `tarefas` (mesmo SQL da seção Docker). Se usar apenas o MySQL do Docker:

```bash
docker compose up -d mysql
```

Conecte em `localhost:3307` com usuário `root` e senha `root`.

### 3. Configurar conexão

O arquivo `backend/src/database.js` está configurado para o ambiente Docker (`host: "mysql"`). Para rodar o backend **fora** do container, altere temporariamente para algo como:

```javascript
host: "localhost",
port: 3307,
user: "root",
password: "root",
database: "prj_apitarefas",
```

> Existe um arquivo `.env` na raiz com variáveis de exemplo (`DB_HOST`, `DB_PORT`, etc.), mas o código ainda **não** lê essas variáveis — a conexão está fixa em `database.js`.

### 4. Iniciar o servidor

```bash
npm run dev
```

A API ficará em [http://localhost:3001](http://localhost:3001). O script `dev` usa **nodemon** e recarrega ao salvar alterações em `backend/src/server.js`.

### 5. Abrir o front-end

Abra `frontend/index.html` no navegador (por exemplo com a extensão **Live Server** do VS Code) ou sirva a pasta `frontend` com um servidor estático.

O JavaScript aponta para `http://localhost:3001/tarefas`. O backend usa **CORS** liberado, então o front pode rodar em outra origem (ex.: `file://` ou porta 5500).

---

## Scripts npm

| Comando       | Descrição                                      |
|---------------|------------------------------------------------|
| `npm run dev` | Sobe a API com nodemon (`backend/src/server.js`) |
| `npm start`   | Definido no `package.json` (ajuste se necessário) |

---

## API REST

Base URL: `http://localhost:3001`

| Método   | Rota            | Descrição                          |
|----------|-----------------|------------------------------------|
| `GET`    | `/`             | Status da API                      |
| `GET`    | `/tarefas`      | Lista todas as tarefas             |
| `GET`    | `/tarefas/:id`  | Busca tarefa por ID                |
| `POST`   | `/tarefas`      | Cria tarefa (`titulo` obrigatório) |
| `PUT`    | `/tarefas/:id`  | Atualiza tarefa completa           |
| `PATCH`  | `/tarefas/:id`  | Atualização parcial (ex.: `status`) |
| `DELETE` | `/tarefas/:id`  | Remove tarefa                      |

### Exemplo — criar tarefa

```bash
curl -X POST http://localhost:3001/tarefas \
  -H "Content-Type: application/json" \
  -d "{\"titulo\":\"Estudar Express\",\"descricao\":\"Revisar rotas REST\"}"
```

Resposta esperada (201):

```json
{
  "id": 1,
  "titulo": "Estudar Express",
  "descricao": "Revisar rotas REST"
}
```

Novas tarefas recebem `status` padrão `pendente`.

### Modelo da tabela `tarefas`

| Campo     | Tipo         | Observação              |
|-----------|--------------|-------------------------|
| `id`      | INT (PK, AI) | Identificador           |
| `titulo`  | VARCHAR      | Obrigatório na API      |
| `descricao` | TEXT       | Opcional                |
| `status`  | VARCHAR      | Ex.: `pendente`, `concluida` |

---

## CI (GitHub Actions)

No push ou pull request para `main`, o workflow em `.github/workflows/ci.yml`:

1. Instala dependências com Node.js 20
2. Valida o Docker
3. Executa `docker compose build`

---

## Documentação adicional

Na pasta [`docs/`](docs/):

- [`workflow.md`](docs/workflow.md) — fluxo de desenvolvimento do projeto
- [`resumoV1.md`](docs/resumoV1.md) — resumo técnico e roadmap
- [`rules.md`](docs/rules.md) — regras e convenções da disciplina

---

## Repositório

```text
git@github-professor:profalonsogui/prj_api_tarefas_aula.git
```

Licença: **ISC**
