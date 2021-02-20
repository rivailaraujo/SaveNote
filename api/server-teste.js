var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');


var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
// set the view engine to ejs
app.set('view engine', 'ejs');

// public folder to store assets
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/img'));
// routes for app

app.get('/', function(req, res) {
    //console.log("Entrou na rota /")
    fs.readFile('./txts/teste.txt', function (err, data) {
        if (err) {

            throw err;
        }
        res.render('pad', {inputTexto: data});
    });
  
});




app.post('/save', urlencodedParser, function(req, res) {

    data = req.body;

    //var fs = require('fs');
    //console.log(data)
    fs.writeFile("./txts/teste.txt", data.txt, function (erro) {

        if (erro) {
            throw erro;
        }

        console.log("Arquivo salvo");
    });

});

// listen on port 8000 (for localhost) or the port defined for heroku
var port = process.env.PORT || 8000;
app.listen(port);