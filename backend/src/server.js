const express = require("express");
const app = express();

// importa conexão com banco
const db = require("./database");

// permite JSON no body
app.use(express.json());


// rota inicial
app.get("/", (req, res) => {
    return res.json({ message: "API de Tarefas com MySQL funcionando!" });
});


// GET /tarefas
app.get("/tarefas", (req, res) => {

    const sql = "SELECT * FROM tarefas";

    db.query(sql, (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar tarefas."
            });
        }

        return res.json(resultados);
    });

});


// POST /tarefas
app.post("/tarefas", (req, res) => {

    const { titulo, descricao } = req.body;

    // valida título
    if (!titulo || titulo.trim() === "") {
        return res.status(400).json({
            erro: "Título é obrigatório."
        });
    }

    const sql = `
        INSERT INTO tarefas (titulo, descricao, status)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            titulo.trim(),
            descricao || null,
            status = "pendente"
        ],
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao cadastrar tarefa."
                });
            }

            return res.status(201).json({
                id: resultado.insertId,
                titulo: titulo.trim(),
                descricao: descricao || null,
            });

        }
    );

});


// servidor
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});