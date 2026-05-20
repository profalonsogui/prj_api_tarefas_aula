# Resumo do Projeto - prj_api_tarefas_aula

## 1. Visão geral

Este projeto é uma pequena aplicação de gerenciamento de tarefas com backend em Node.js/Express e banco de dados MySQL. A aplicação oferece uma API REST básica para operações CRUD sobre tarefas e um front-end estático simples em HTML/CSS.

## 2. Tecnologias

- Node.js
- Express 5
- MySQL (via mysql2)
- frontend estático em HTML e CSS
- Dependência de desenvolvimento: nodemon

## 3. Estrutura do projeto

- `package.json` - dependências, scripts e configuração do projeto
- `backend/src/server.js` - API REST com rotas para tarefas
- `backend/src/database.js` - conexão MySQL local
- `frontend/index.html` - página de teste ou ponto de partida do front-end
- `frontend/sobre.html` - página adicional estática
- `frontend/css/style.css` - estilo básico do front-end

## 4. Funcionalidades atuais

### API de tarefas

- `GET /` - rota de status que retorna mensagem de funcionamento
- `GET /tarefas` - lista todas as tarefas
- `GET /tarefas/:id` - busca tarefa por ID
- `POST /tarefas` - cria nova tarefa com título, descrição e status padrão `pendente`
- `PUT /tarefas/:id` - atualiza tarefa inteira (título, descrição e status)
- `PATCH /tarefas/:id` - atualiza parcialmente tarefa
- `DELETE /tarefas/:id` - remove tarefa por ID

### Backend

- validação básica de presença de título no `POST` e `PUT`
- tratamento de erros simples com mensagens JSON
- conexão ao banco `prj_apitarefas` em MySQL local

### Front-end

- front-end muito simples, atualmente com conteúdo de teste em `index.html`
- estrutura de pastas pronta para expansão com CSS separado

## 5. Pontos fortes do projeto

- API REST bem definida para CRUD de tarefas
- uso de Express e MySQL em arquitetura leve
- boa base para adicionar camadas de front-end e autenticação
- separação inicial entre backend e frontend

## 6. Oportunidades de melhoria e próximas funcionalidades

### 6.1. Melhorias imediatas

- adicionar documentação de API no `README.md` ou `docs/`.
- criar um front-end funcional que consuma a API de tarefas.
- usar variáveis de ambiente para dados sensíveis do banco de dados em vez de valores fixos no código.
- implementar validação mais robusta e tratamento de erros padronizado.

### 6.2. Funcionalidades recomendadas para o próximo ciclo

1. Autenticação de usuários
   - cadastro e login
   - tarefas associadas a usuários
   - proteção das rotas de gerenciamento de tarefas

2. Status e filtros para tarefas
   - filtragem por `pendente`, `concluída`, `em andamento`
   - ordenação por data de criação ou prioridade

3. Front-end interativo
   - página de lista de tarefas com criação/edição/exclusão
   - interface responsiva usando HTML, CSS e JavaScript
   - feedback visual para operações bem-sucedidas ou falhas

4. Melhorias no banco de dados
   - tabela de usuários
   - relacionamento `tarefas -> usuários`
   - campos adicionais: `data_criacao`, `data_conclusao`, `prioridade`

5. Documentação e testes
   - adicionar testes automatizados para rotas da API
   - escrever instruções de instalação e execução no `README.md`
   - incluir um script de inicialização de banco ou instruções de migração

## 7. Observações finais

O projeto já tem uma base funcional de API e demonstrações iniciais. A próxima etapa mais valiosa é transformar o front-end atual em uma interface que consuma a API e adicionar autenticação/usuários para tornar o sistema útil em um cenário real.
