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

// POST /tarefas - criar uma nova tarefa
app.post('/tarefas', (req, res) => {

    const { titulo } = req.body; // extrai o título do corpo da requisição

    // valida se o título foi enviado e não está vazio
    if (!titulo || titulo.trim() === '') {
        return res.status(400).json({ erro: 'O título é obrigatório' });
    }

    // cria o objeto da nova tarefa
    const novaTarefa = {
        id: proximoId,        // usa o próximo ID disponível
        titulo: titulo.trim(), // remove espaços extras do início e fim
        concluida: false       // toda tarefa começa como não concluída
    };

    tarefas.push(novaTarefa); // adiciona a nova tarefa ao array
    proximoId++;              // incrementa o ID para a próxima tarefa

    // retorna a tarefa criada com status 201 (Created)
    return res.status(201).json(novaTarefa);
});


//definindo porta para o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});