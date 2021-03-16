const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');


exports.postDocumento = async (req, res, next) => {
    try {
        
        data = req.body;

        console.log(data)
        //var fs = require('fs');
        //console.log(data)
        fs.writeFile("./txts/teste2.txt", data.txt, function (erro) {
    
            if (erro) {
                throw erro;
            }
    
            console.log("Arquivo salvo");
            return res.status(200).send({
                mensagem: 'salvo',
            });
        });
    

        
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
};

exports.getDocumento = async (req, res, next) => {
    try {
        
        fs.readFile('./txts/teste2.txt', 'utf8', function (err, data) {
            if (err) {
    
                throw err;
            }
            return res.status(200).send(
                data
            );

        });
    

        
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
};