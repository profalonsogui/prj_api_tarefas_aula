# Workflow de Desenvolvimento

## O que é um Workflow?

Workflow é um fluxo de trabalho.

No desenvolvimento de software, workflow representa a ordem das etapas que devemos seguir para criar um projeto de forma organizada.

O objetivo é evitar:
- sair programando sem planejamento
- bagunça no código
- erros desnecessários
- retrabalho
- perda de tempo

Mesmo projetos simples devem seguir um pequeno planejamento.

Neste projeto da disciplina PBE, vamos usar um workflow simples para aprender a desenvolver APIs de forma mais profissional e organizada.

---

# Workflow Base do Projeto - API de Tarefas

## 1. Entender o problema

Antes de programar:
- Qual o objetivo do sistema?
- O que o sistema deve fazer?
- Quem vai usar?
- Quais funcionalidades são necessárias?

### Exemplo do projeto

Sistema:
- API de gerenciamento de tarefas

Funcionalidades:
- criar tarefas
- listar tarefas
- editar tarefas
- remover tarefas

---

## 2. Planejar o banco de dados

Pensar:
- quais tabelas existirão
- quais campos serão necessários
- como os dados irão se relacionar

### Exemplo

Tabela `tarefas`

| Campo | Tipo |
|---|---|
| id | int |
| titulo | varchar |
| descricao | text |
| status | varchar |

---

## 3. Planejar as rotas da API

Definir:
- quais rotas existirão
- qual método HTTP usar
- qual será a função de cada rota

### Exemplo

| Método | Rota | Função |
|---|---|---|
| GET | /tarefas | listar tarefas |
| GET | /tarefas/:id | buscar tarefa |
| POST | /tarefas | criar tarefa |
| PUT | /tarefas/:id | atualizar tarefa |
| DELETE | /tarefas/:id | remover tarefa |

---

## 4. Criar estrutura do projeto

Organizar pastas e arquivos.

### Estrutura inicial

```txt
backend/
frontend/