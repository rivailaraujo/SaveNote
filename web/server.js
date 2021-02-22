const http = require('http');
var express = require('express');
//const app = require('./app');
const fs = require('fs');
const port = process.env.PORT || 8000;




var app = express();
const server = http.createServer(app);
server.listen(port);
// set the view engine to ejs
app.set('view engine', 'ejs');


// public folder to store assets
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/img'));
// routes for app

app.get('/editor', function(req, res) {
    //console.log("Entrou na rota /")
    fs.readFile('./txts/teste.txt', function (err, data) {
        if (err) {

            throw err;
        }
        res.render('pad', {inputTexto: data});
    });
  
});

app.get('/', function(req, res) {
    //console.log("Entrou na rota /")
        
        res.render('home');
  
});



