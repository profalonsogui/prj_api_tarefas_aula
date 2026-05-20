const API_URL = "http://localhost:3001/tarefas";

const form = document.getElementById("form-tarefa");
const inputTitulo = document.getElementById("titulo");
const inputDescricao = document.getElementById("descricao");
const listaTarefas = document.getElementById("lista-tarefas");

// Carregar tarefas ao abrir a página
document.addEventListener("DOMContentLoaded", carregarTarefas);

// Cadastrar nova tarefa
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const novaTarefa = {
    titulo: inputTitulo.value,
    descricao: inputDescricao.value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novaTarefa)
  });

  form.reset();
  carregarTarefas();
});

// Buscar tarefas
async function carregarTarefas() {
  const resposta = await fetch(API_URL);
  const tarefas = await resposta.json();

  listaTarefas.innerHTML = "";

  tarefas.forEach((tarefa) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${tarefa.titulo}</h3>
      <p>${tarefa.descricao || "Sem descrição"}</p>
      <p>Status: <strong>${tarefa.status}</strong></p>

      <button onclick="alterarStatus(${tarefa.id}, '${tarefa.status}')">
        ${tarefa.status === "concluida" ? "Marcar como pendente" : "Concluir"}
      </button>

      <button onclick="deletarTarefa(${tarefa.id})">
        Excluir
      </button>
    `;

    listaTarefas.appendChild(card);
  });
}

// Alterar status
async function alterarStatus(id, statusAtual) {
  const novoStatus = statusAtual === "concluida" ? "pendente" : "concluida";

  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: novoStatus
    })
  });

  carregarTarefas();
}

// Deletar tarefa
async function deletarTarefa(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  carregarTarefas();
}