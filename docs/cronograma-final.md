# Cronograma Final — API Tarefas com Docker + MySQL

## Objetivo

Finalizar a adaptação do projeto `api_tarefas` para rodar com Docker.

No `cronograma1.md`, o projeto ficou assim:

```txt
API Node.js rodando localmente
MySQL rodando via Docker
API conectando no MySQL Docker
Banco prj_apitarefas criado
Tabelas users e tarefas recriadas
```

Nesta etapa final, o objetivo foi evoluir para:

```txt
API Node.js rodando via Docker
MySQL rodando via Docker
API e MySQL subindo juntos pelo docker-compose.yml
```

---

## 1. Situação antes desta etapa

Antes desta continuação, apenas o banco estava no Docker.

A API ainda era iniciada localmente com:

```bash
npm run dev
```

Ou seja:

```txt
Node.js local
MySQL Docker
```

---

## 2. Criação do Dockerfile

Foi criado o arquivo:

```txt
Dockerfile
```

Esse arquivo serve para ensinar o Docker como montar a imagem da API.

Código usado:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
```

---

## 3. Explicação do Dockerfile

### FROM

```dockerfile
FROM node:20-alpine
```

Usa uma imagem do Node.js como base.

### WORKDIR

```dockerfile
WORKDIR /app
```

Define a pasta de trabalho dentro do container.

### COPY package*.json

```dockerfile
COPY package*.json ./
```

Copia os arquivos de dependências do projeto.

### RUN npm install

```dockerfile
RUN npm install
```

Instala as dependências da API dentro do container.

### COPY . .

```dockerfile
COPY . .
```

Copia o restante dos arquivos do projeto para dentro do container.

### EXPOSE

```dockerfile
EXPOSE 3001
```

Informa que a API usa a porta `3001`.

### CMD

```dockerfile
CMD ["npm", "run", "dev"]
```

Define o comando usado para iniciar a API.

---

## 4. Criação do .dockerignore

Foi criado o arquivo:

```txt
.dockerignore
```

Esse arquivo serve para evitar que arquivos desnecessários sejam copiados para dentro da imagem Docker.

Código usado:

```txt
node_modules
.git
.gitignore
npm-debug.log
```

---

## 5. Atualização do docker-compose.yml

Antes, o `docker-compose.yml` subia apenas o MySQL.

Depois, ele foi alterado para subir:

```txt
API + MySQL
```

Código usado inicialmente:

```yaml
services:
  api:
    build: .
    container_name: api-tarefas
    restart: always
    ports:
      - "3001:3001"
    depends_on:
      - mysql

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

## 6. Explicação da atualização do docker-compose.yml

### Serviço api

```yaml
api:
  build: .
```

Cria a imagem da API usando o `Dockerfile` que está na raiz do projeto.

### container_name

```yaml
container_name: api-tarefas
```

Define o nome do container da API.

### ports

```yaml
ports:
  - "3001:3001"
```

Liga a porta `3001` da máquina com a porta `3001` do container.

### depends_on

```yaml
depends_on:
  - mysql
```

Indica que a API depende do serviço MySQL.

---

## 7. Alteração no database.js

Antes, quando a API rodava localmente, a conexão era feita assim:

```js
host: "localhost",
port: 3307
```

Isso acontecia porque a API estava fora do Docker e precisava acessar o MySQL pela porta da máquina.

Depois que a API passou a rodar dentro do Docker, foi necessário alterar para:

```js
host: "mysql",
port: 3306
```

Novo `database.js`:

```js
const mysql = require("mysql2");

// cria conexão com banco
const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "prj_apitarefas",
    port: 3306
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

## 8. Explicação da mudança no host e na porta

Quando a API rodava localmente:

```txt
API local → localhost:3307 → MySQL Docker
```

Quando a API passou a rodar no Docker:

```txt
API Docker → mysql:3306 → MySQL Docker
```

Dentro do Docker Compose, os containers se comunicam pelo nome do serviço.

Por isso o host passou a ser:

```js
host: "mysql"
```

A porta voltou para:

```js
port: 3306
```

Porque `3306` é a porta interna do MySQL dentro do container.

A senha continuou sendo:

```js
password: "root"
```

Porque ela foi definida no `docker-compose.yml`:

```yaml
MYSQL_ROOT_PASSWORD: root
```

---

## 9. Parando a aplicação local e containers antigos

Antes de subir tudo via Docker, foi necessário parar a API local.

No terminal da API:

```bash
CTRL + C
```

Depois, foi usado:

```bash
docker compose down
```

Esse comando para e remove os containers criados pelo Docker Compose.

Os dados do banco não foram apagados, pois estavam salvos no volume:

```yaml
volumes:
  - mysql_data:/var/lib/mysql
```

---

## 10. Subindo API + MySQL com Docker

Depois das alterações, foi usado:

```bash
docker compose up --build
```

Explicação:

```txt
docker compose up = sobe os serviços
--build = constrói novamente a imagem da API
```

Nesse momento, o Docker tentou subir:

```txt
api-tarefas
mysql-api-tarefas
```

---

## 11. Erro encontrado

Ao subir os containers, a API iniciou antes do MySQL ficar totalmente pronto.

O erro foi parecido com:

```txt
Erro ao conectar: connect ECONNREFUSED 172.21.0.2:3306
```

Isso aconteceu porque o container da API tentou se conectar ao banco antes do MySQL estar pronto para aceitar conexões.

---

## 12. Entendendo o problema

O `depends_on` simples garante apenas que o container do MySQL seja iniciado antes da API.

Mas isso não garante que o MySQL já esteja pronto para receber conexão.

Ou seja:

```txt
MySQL iniciado
```

não é a mesma coisa que:

```txt
MySQL pronto para conexão
```

---

## 13. Correção com healthcheck

Para resolver o problema, o `docker-compose.yml` foi atualizado com um `healthcheck`.

O `healthcheck` verifica se o MySQL já está pronto.

Código final do `docker-compose.yml`:

```yaml
services:
  api:
    build: .
    container_name: api-tarefas
    restart: always
    ports:
      - "3001:3001"
    depends_on:
      mysql:
        condition: service_healthy

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
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-proot"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  mysql_data:
```

---

## 14. Explicação do healthcheck

### test

```yaml
test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-proot"]
```

Testa se o MySQL está respondendo.

### interval

```yaml
interval: 5s
```

Define que o Docker fará a verificação a cada 5 segundos.

### timeout

```yaml
timeout: 5s
```

Define o tempo máximo de espera para cada tentativa.

### retries

```yaml
retries: 10
```

Define a quantidade de tentativas antes de considerar erro.

---

## 15. depends_on com condition

A API foi configurada assim:

```yaml
depends_on:
  mysql:
    condition: service_healthy
```

Isso significa:

```txt
A API só deve iniciar quando o MySQL estiver saudável.
```

Essa alteração resolveu o problema da API iniciar antes do banco.

---

## 16. Subindo novamente após a correção

Depois da alteração no `docker-compose.yml`, foi usado novamente:

```bash
docker compose up --build
```

Dessa vez, a API conseguiu conectar corretamente no MySQL.

Resultado esperado:

```txt
Servidor rodando em http://localhost:3001
Conectado ao MySQL via Docker!
```

---

## 17. Situação final do projeto

Agora o projeto está assim:

```txt
API Node.js rodando via Docker
MySQL rodando via Docker
API e MySQL conectados pela rede do Docker Compose
Banco prj_apitarefas disponível
Tabelas users e tarefas mantidas
```

---

## 18. Como rodar o projeto agora

Para subir tudo:

```bash
docker compose up --build
```

Para parar:

```bash
CTRL + C
```

Ou, em outro terminal:

```bash
docker compose down
```

---

## 19. Diferença entre antes e agora

### Antes

```txt
API rodava localmente com npm run dev
MySQL rodava via Docker
database.js usava localhost:3307
```

### Agora

```txt
API roda via Docker
MySQL roda via Docker
database.js usa mysql:3306
```

---

## 20. Próximo passo possível

Depois dessa finalização, o projeto já está pronto para avançar para:

```txt
Pipeline com GitHub Actions
Build automático
Testes automatizados
CI/CD básico
```

Mas até aqui, o foco foi finalizar a execução da API e do MySQL via Docker Compose.
