// let = valor pode ser alterado
//const = valor não pode ser alterado

//importando o express
const express = require('express');

//criando uma aplicação express
const app = express();

//configurando o express para receber requisições com corpo em formato JSON
app.use(express.json());

/* concluida do tipo booleano, para indicar se a tarefa foi concluída ou não
true = verdadeiro; false = falso */
let tarefas = [
    { id: 1, titulo: 'Preparar TCC', concluida: false},
    { id: 2, titulo: 'Fazer atividade', concluida: true}
];

let proximoId = 3; //variável para controlar o próximo ID a ser atribuído

//definindo uma rota para a raiz do site
app.get('/', (req, res) => {
    //res.send('Olá mundo!');
    return res.json({ message: 'API de Tarefas funcionando!'});
});

// get /tarefas - listar todas as tarefas
/*
req = request (requisição) - objeto que representa a requisição feita pelo cliente
res = response (resposta) - objeto que representa a resposta que será enviada para o cliente
*/
app.get('/tarefas', (req, res) => {
    // lÊ as tarefas e retorna em formato JSON
    const { concluida} = req.query; //desestruturação para obter o valor de "concluida" da query string

    // se não veio o filtro, devolve tudo.
    if (concluida === undefined) {
        return res.json(tarefas); //retorna todas as tarefas
    }

    // converter string para booleano
    const valor = concluida === 'true'; //converte a string "true" para booleano true, e qualquer outra coisa para false

    // filtra as tarefas com base no valor de "concluida"
    const tarefasFiltradas = tarefas.filter((t) => t.concluida === valor);
    
    return res.json(tarefasFiltradas); //retorna as tarefas filtradas
});


//definindo porta para o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});