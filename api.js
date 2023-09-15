const aux = require('./auxiliar.js')
const sql = require('./sqlcommands.js');

const client = require('./connection.js');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.listen(3300, () => {
    console.log("Server is now listening at port 3300");
});

client.connect();


app.get('/produtores/todos', (req, res) => {
    client.query(sql.selectionar_todos,
        (err, result)=>{
        if (!err) {
            for (i = 0; i < result.rows.length; ++i)
                result.rows[i].culturas = aux.parse_culturas_from_string(result.rows[i].culturas.toString());
            res.json(result.rows);
        }
    });
    client.end;
});

app.get('/produtores/selecionar/:id', (req, res) => {
    client.query(sql.selecionar_id(req.params.id), (err, result)=>{
        if (!err && result.rows.length > 0) {
            result.rows[0].culturas = aux.parse_culturas_from_string(result.rows[0].culturas);
            res.json(result.rows[0]);
        }
        else {
            res.send("O produtor selecionado não foi encontrado.");
        }
    });
    client.end;
});

app.post('/produtores/cadastrar', (req, res) => {
    const cadastro = req.body
    try {
        insertQuery = sql.cadastrar(cadastro);
    }
    catch(e) {
        res.send(e.toString());
        return
    }
    client.query(insertQuery, (err, result)=>{
        if (!err) {
            res.send("Produtor cadastrado com sucesso.");
        }
        else {
            res.send(err.message);
        }
    });
    client.end;
});

app.post('/produtores/editar', (req, res) => {
    const update = req.body
    try {
        editQuery = sql.editar_id(update);
    }
    catch(e) {
        res.send(e.toString());
        return
    }
    client.query(editQuery, (err, result)=>{
        if (!err) {
            res.send("Produtor editado com sucesso.");
        }
        else {
            res.send(err.message);
        }
    });
    client.end;
});

app.post('/produtores/editar/:atrib', (req, res) => {
    const body = req.body
    try {
        editQuery = sql.editar_atributo_produtor(req.params.atrib, body);
    }
    catch(e) {
        res.send(e.toString());
        return
    }
    client.query(editQuery, (err, result)=>{
        if (!err) {
            res.send("Produtor editado com sucesso.");
        }
        else {
            res.send(err.message);
        }
    });
    client.end;
});

app.post('/fazendas/editar/:atrib', (req, res) => {
    const body = req.body
    try {
        editQuery = sql.editar_atributo_fazenda(req.params.atrib, body)
    }
    catch(e) {
        res.send(e.toString());
        return
    }
    client.query(editQuery, (err, result)=>{
        if (!err) {
            res.send("Fazenda editada com sucesso.");
        }
        else {
            res.send(err.message);
        }
    });
    client.end;
});

app.get('/produtores/excluir/:id', (req, res) => {
    client.query(sql.excluir(req.params.id), (err, result)=>{
        if (!err) {
            res.send("Produtor excluido com sucesso.");
        }
        else res.send(err.message);
    });
    client.end;
});

app.get('/dashboard/total_fazendas', (req, res) => {
    client.query(sql.total_fazendas, (err, result)=>{
        if (!err && result.rows.length > 0) {
            res.send(result.rows[0]);
        }
    });
    client.end;
});

app.get('/dashboard/area_total_fazendas', (req, res) => {
    client.query(sql.area_total_fazendas, (err, result)=>{
        if (!err && result.rows.length > 0) {
            res.send(result.rows[0]);
        }
    });
    client.end;
});

app.get('/dashboard/total_por_estado', (req, res) => {
    client.query(sql.total_por_estado, (err, result)=>{
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
});

app.get('/dashboard/total_por_cultura', (req, res) => {
    client.query(sql.total_por_cultura, (err, result)=>{
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
});

app.get('/dashboard/uso_de_solo', (req, res) => {
    client.query(sql.uso_de_solo, (err, result)=>{
        if (!err && result.rows.length > 0) {
            res.send(result.rows[0]);
        }
    });
    client.end;
});

