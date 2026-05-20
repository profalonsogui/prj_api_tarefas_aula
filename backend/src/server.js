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

// GET /tarefas/:id
// GET /tarefas/:id -> buscar tarefa por ID
app.get("/tarefas/:id", (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM tarefas WHERE id = ?";

    db.query(sql, [id], (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar tarefa."
            });
        }

        // verifica se encontrou
        if (resultados.length === 0) {
            return res.status(404).json({
                erro: "Tarefa não encontrada."
            });
        }

        return res.json(resultados[0]);
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

// PUT /tarefas/:id
// PUT /tarefas/:id -> atualizar tarefa
app.put("/tarefas/:id", (req, res) => {

    const { id } = req.params;
    const { titulo, descricao, status } = req.body;

    // valida título
    if (!titulo || titulo.trim() === "") {
        return res.status(400).json({
            erro: "Título é obrigatório."
        });
    }

    const sql = `
        UPDATE tarefas
        SET titulo = ?, descricao = ?, status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            titulo.trim(),
            descricao || null,
            status || "pendente",
            id
        ],
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao atualizar tarefa."
                });
            }

            // verifica se atualizou algo
            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    erro: "Tarefa não encontrada."
                });
            }

            return res.json({
                mensagem: "Tarefa atualizada com sucesso."
            });

        }
    );

});

// PATCH /tarefas/:id
// PATCH /tarefas/:id -> atualizar parcialmente (ex: só status)
app.patch("/tarefas/:id", (req, res) => {

    const { id } = req.params;
    const { titulo, descricao, status } = req.body;

    // verifica se veio pelo menos 1 campo
    if (!titulo && !descricao && !status) {
        return res.status(400).json({
            erro: "Envie pelo menos um campo para atualizar."
        });
    }

    // monta SQL dinamicamente (forma simples)
    let campos = [];
    let valores = [];

    if (titulo) {
        campos.push("titulo = ?");
        valores.push(titulo.trim());
    }

    if (descricao) {
        campos.push("descricao = ?");
        valores.push(descricao);
    }

    if (status) {
        campos.push("status = ?");
        valores.push(status);
    }

    const sql = `
        UPDATE tarefas
        SET ${campos.join(", ")}
        WHERE id = ?
    `;

    valores.push(id);

    db.query(sql, valores, (erro, resultado) => {

        if (erro) {
            return res.status(500).json({
                erro: "Erro ao atualizar tarefa."
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: "Tarefa não encontrada."
            });
        }

        return res.json({
            mensagem: "Tarefa atualizada parcialmente com sucesso."
        });

    });

});

// DELETE /tarefas/:id
// DELETE /tarefas/:id -> remover tarefa
app.delete("/tarefas/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM tarefas WHERE id = ?";

    db.query(sql, [id], (erro, resultado) => {

        if (erro) {
            return res.status(500).json({
                erro: "Erro ao deletar tarefa."
            });
        }

        // verifica se deletou
        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: "Tarefa não encontrada."
            });
        }

        return res.json({
            mensagem: "Tarefa removida com sucesso."
        });

    });

});

// servidor
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// exportar o app
module.exports = app;