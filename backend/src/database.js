const mysql = require('mysql2');

// criar a conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projeto_api_tarefas'
});

// conecta ao Banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!');
});

module.exports = connection;