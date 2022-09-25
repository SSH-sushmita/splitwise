const express = require('express');
const mysql      = require('mysql2');
const bodyParser = require("body-parser")
const { sqldb } = require('./config');
const handlers = require('./etc/routemap-config.json')
const routemap = {};

const connection = mysql.createConnection({
    user: sqldb.user,
    password: sqldb.password,
    server: sqldb.server,
    database: sqldb.database,
    multipleStatements: true
});

connection.query('show tables', function (error) {
    if (error) {
        console.error(error);
        process.exit(0);
    } else {    
        console.log('The connection to db is successfull');
    }    
});

const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json())

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Server listening at http://%s:%s", host, port)
})

handlers.routes.forEach(element => {
    routemap[`${element.method}-${element.path}`] = require(`${element.module}`);
});

app.post('/v1/user', function (req, res) {
    routemap['post-/v1/user']['user'](connection, req.body, res);
})

app.post('/v1/group', function (req, res) {
    routemap['post-/v1/group']['group'](connection, req.body, res);
})

app.post('/v1/group/:groupId', function (req, res) {
    routemap['post-/v1/group/:groupId']['groupUser'](connection, req.body, res, req.params.groupId);
})

app.post('/v1/expense', function (req, res) {
    routemap['post-/v1/expense']['expense'](connection, req.body, res, req.params.groupId, null);
})

app.post('/v1/expense/:expenseId', function (req, res) {
    routemap['post-/v1/expense/:expenseId']['expense'](connection, req.body, res, req.params.expenseId);
})

app.get('/v1/transaction/:userId', function (req, res) {
    routemap['get-/v1/transaction/:userId']['transaction'](connection, req.query, res, req.params.userId);
})
