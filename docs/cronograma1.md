# Cronograma 1 — Adaptação inicial do projeto API Tarefas com Docker + MySQL

## Objetivo

Adaptar o projeto `api_tarefas` que já estava em andamento para começar a usar **MySQL via Docker**, mantendo a API em Node.js rodando localmente neste primeiro momento.

A ideia inicial foi não trocar o banco para MongoDB, pois o projeto já usa MySQL. Assim, a aula fica mais simples para os alunos.

---

## 1. Decisão inicial

Foi decidido manter:

```txt
Node.js + Express + MySQL
```

E alterar apenas a forma de executar o banco de dados:

```txt
Antes: MySQL instalado localmente na máquina
Agora: MySQL rodando em container Docker
```

Isso ajuda os alunos a entenderem Docker sem mudar toda a lógica do projeto.

---

## 2. Criação do arquivo docker-compose.yml

Na raiz do projeto, foi criado o arquivo:

```txt
docker-compose.yml
```

Esse arquivo serve para configurar e subir o MySQL usando Docker.

Código usado:

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-api-tarefas
    restart: always

    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: prj_apitarefas

    ports:
      - "3307:3306"

    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

---

## 3. Explicação do docker-compose.yml

### image

```yaml
image: mysql:8.0
```

Define que será usada a imagem oficial do MySQL na versão 8.

### container_name

```yaml
container_name: mysql-api-tarefas
```

Define um nome para o container.

### environment

```yaml
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: prj_apitarefas
```

Define a senha do usuário `root` e cria automaticamente o banco `prj_apitarefas`.

### ports

```yaml
ports:
  - "3307:3306"
```

Significa:

```txt
3307 = porta usada na máquina
3306 = porta interna do container MySQL
```

Então a API deve se conectar usando a porta `3307`.

### volumes

```yaml
volumes:
  - mysql_data:/var/lib/mysql
```

Serve para manter os dados do banco salvos, mesmo se o container for parado.

---

## 4. Subindo o MySQL com Docker

Com o arquivo `docker-compose.yml` criado, o próximo passo foi subir o container:

```bash
docker compose up -d
```

Explicação:

```txt
docker compose up = sobe os serviços do docker-compose.yml
-d = executa em segundo plano
```

---

## 5. Verificando se o container está rodando

Depois de subir o container, foi usado:

```bash
docker ps
```

Esse comando mostra os containers em execução.

O esperado é aparecer o container:

```txt
mysql-api-tarefas
```

---

## 6. Alteração no database.js

O projeto antes conectava no MySQL local, sem senha:

```js
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "prj_apitarefas"
});
```

Como agora o MySQL está no Docker, foi necessário alterar a senha e a porta.

Novo `database.js`:

```js
const mysql = require("mysql2");

// cria conexão com banco
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "prj_apitarefas",
    port: 3307
});

// conecta
connection.connect((err) => {
    if (err) {
        console.error("Erro ao conectar:", err);
        return;
    }

    console.log("Conectado ao MySQL via Docker!");
});

module.exports = connection;
```

---

## 7. Explicação da alteração no database.js

### password

Antes:

```js
password: ""
```

Agora:

```js
password: "root"
```

Isso acontece porque no Docker Compose foi definida a senha:

```yaml
MYSQL_ROOT_PASSWORD: root
```

### port

Foi adicionada a porta:

```js
port: 3307
```

Porque o MySQL do Docker está sendo acessado pela máquina através da porta `3307`.

---

## 8. Erro encontrado durante o teste

Ao rodar a API, apareceu o erro:

```txt
Access denied for user 'root' ... using password: NO
```

Esse erro indicava que a aplicação ainda estava tentando conectar sem senha.

A correção foi confirmar se o `database.js` estava usando:

```js
password: "root",
port: 3307
```

---

## 9. Rodando a API novamente

Depois da alteração no `database.js`, a API deve ser rodada com:

```bash
npm run dev
```

O esperado é aparecer:

```txt
Servidor rodando em http://localhost:3001
Conectado ao MySQL via Docker!
```

---

## 10. Acessando o MySQL visualmente

Mesmo usando Docker, ainda é possível acessar o MySQL por ferramentas visuais, como:

```txt
MySQL Workbench
DBeaver
HeidiSQL
```

Dados de conexão:

| Campo | Valor |
|---|---|
| Host | localhost |
| Porta | 3307 |
| Usuário | root |
| Senha | root |
| Banco | prj_apitarefas |

---

## 11. Recriação inicial das tabelas

Como o MySQL via Docker é um novo ambiente, pode ser necessário recriar as tabelas.

O banco `prj_apitarefas` pode já ter sido criado automaticamente pelo Docker Compose, por causa desta configuração:

```yaml
MYSQL_DATABASE: prj_apitarefas
```

Mas as tabelas precisam ser criadas manualmente.

---

## 12. Criando tabela users

```sql
USE prj_apitarefas;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL
);
```

Essa tabela foi mantida para aproveitamento futuro no projeto.

---

## 13. Criando tabela tarefas

Com base no código atual do `server.js`, a tabela `tarefas` precisa dos campos:

```txt
id
titulo
descricao
status
```

SQL usado:

```sql
CREATE TABLE tarefas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'pendente'
);
```

---

## 14. Inserindo dados de teste

```sql
INSERT INTO users (nome, email, senha)
VALUES 
('Admin', 'admin@email.com', '123456'),
('Aluno Teste', 'aluno@email.com', '123456');

INSERT INTO tarefas (titulo, descricao, status)
VALUES
('Estudar Docker', 'Entender o uso do MySQL via Docker', 'pendente'),
('Criar pipeline', 'Criar pipeline simples com GitHub Actions', 'pendente'),
('Testar API', 'Testar rotas GET, POST, PUT e DELETE', 'concluida');
```

---

## 15. Conferindo os dados

```sql
SELECT * FROM users;
SELECT * FROM tarefas;
```

Esses comandos servem para verificar se as tabelas foram criadas e se os dados foram inseridos corretamente.

---

## 16. Situação atual do projeto

Até este momento, o projeto está assim:

```txt
API Node.js rodando localmente
MySQL rodando via Docker
API conectando no MySQL Docker
Banco prj_apitarefas criado
Tabelas users e tarefas recriadas
```

---

## 17. Próximo passo futuro

Depois dessa base estar funcionando, os próximos passos podem ser:

```txt
1. Criar Dockerfile da API
2. Rodar API também via Docker
3. Ajustar docker-compose.yml para API + MySQL
4. Criar pipeline com GitHub Actions
```

Mas até aqui, o foco foi apenas a adaptação inicial do projeto para usar MySQL via Docker.
