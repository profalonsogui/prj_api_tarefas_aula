# Resumo do Projeto - V2

## 1. Visao geral
O `prj_api_tarefas_aula` e um projeto didatico de API de tarefas para a disciplina PBE.
Ele possui backend em Node.js/Express, banco MySQL e frontend estatico em HTML/CSS/JS que consome a API.

## 2. Estrutura atual
- `backend/src/database.js`: conexao MySQL (host `mysql`, porta `3306`, usuario `root`, senha `root`, banco `prj_apitarefas`).
- `backend/src/server.js`: API REST com CRUD completo de tarefas.
- `backend/src/server.txt`: versao antiga/legado de servidor (nao e o servidor principal).
- `frontend/index.html`: tela principal de tarefas.
- `frontend/css/style.css`: estilos da interface.
- `frontend/js/script.js`: chamadas `fetch` para a API.
- `Dockerfile`: imagem da API (Node 20 Alpine).
- `docker-compose.yaml`: sobe API + MySQL com `healthcheck` no banco.
- `README.md`: guia completo de uso local e com Docker.
- `docs/`: materiais de apoio da disciplina e historico do projeto.

## 3. Backend (o que esta implementado)
Base URL: `http://localhost:3001`

Rotas disponiveis:
- `GET /` - status da API.
- `GET /tarefas` - lista tarefas.
- `GET /tarefas/:id` - busca por ID.
- `POST /tarefas` - cria tarefa (`titulo` obrigatorio, status inicial `pendente`).
- `PUT /tarefas/:id` - atualiza tarefa completa.
- `PATCH /tarefas/:id` - atualiza parcialmente (`titulo`, `descricao` e/ou `status`).
- `DELETE /tarefas/:id` - remove tarefa.

Detalhes:
- CORS habilitado.
- Respostas de erro em JSON.
- Validacao basica de `titulo` em `POST` e `PUT`.

## 4. Banco de dados
Banco esperado: `prj_apitarefas`.

Tabela principal usada pela API:
- `tarefas(id, titulo, descricao, status)`

Status padrao de tarefa nova: `pendente`.

## 5. Frontend (o que faz hoje)
Interface simples para:
- cadastrar tarefa;
- listar tarefas;
- alternar status entre `pendente` e `concluida`;
- excluir tarefa.

A comunicacao ocorre por `fetch` em `http://localhost:3001/tarefas`.

## 6. Docker e execucao
- `docker-compose.yaml` sobe dois servicos: `api` e `mysql`.
- API exposta em `3001`.
- MySQL exposto em `3307` no host (`3306` interno).
- `depends_on` com `condition: service_healthy` para evitar subida da API antes do banco estar pronto.

Comando principal:
- `docker compose up --build`

## 7. Scripts npm
- `npm run dev`: inicia backend correto (`backend/src/server.js`) com nodemon.
- `npm start`: atualmente aponta para `node server.js` (na raiz), podendo exigir ajuste para uso em producao.
- `npm test`: placeholder padrao (sem testes implementados).

## 8. Dependencias do projeto
- Producao: `express`, `mysql2`, `cors`.
- Desenvolvimento: `nodemon`.

## 9. Documentacao em docs/
- `workflow.md`: fluxo de desenvolvimento da API.
- `rules.md`: regras e boas praticas para o projeto.
- `cronograma1.md`: fase inicial (MySQL no Docker e API local).
- `cronograma-final.md`: fase final (API + MySQL no Docker, healthcheck).
- `manual-projeto.md`: manual tecnico consolidado.
- `resumoV1.md`: resumo anterior do estado do projeto.

## 10. Estado atual consolidado
O projeto esta funcional para CRUD de tarefas com persistencia em MySQL, frontend simples integrado e ambiente Docker pronto para uso em aula. O proximo passo natural e evoluir testes automatizados, padronizar variaveis de ambiente e ajustar o script `start` para o caminho real do servidor.
