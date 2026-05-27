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