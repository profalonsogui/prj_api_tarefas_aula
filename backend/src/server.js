// importar o express
const express = require('express');
// importar o database
const db = require('../src/database');

// criar o servidor
const app = express();

// middleware para parsear o corpo da requisição
app.use(express.json());

// rota GET para listar todas as tarefas
app.get('/tarefas', (req, res) => {
    db.query('SELECT * FROM tarefas', (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar tarefas'});
        }
        res.json(result);
    });
});

// rota POST para criar uma nova tarefa


// rota PUT /:id para atualizar uma tarefa existente


// rota DELETE /:id para deletar uma tarefa existente

// iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
});

// rota para testar a conexão com o banco de dados
app.get('/', (req, res) => {
    res.send('Conexão com o banco de dados estabelecida com sucesso!');
});

// exportar o app
module.exports = app;