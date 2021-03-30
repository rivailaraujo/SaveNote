const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
//INSERT INTO `notebook` (`nome_notebook`, `publico`, `avaliacao_media`, `id_usuario`, `criado`) VALUES ('', '', '0', '', '');

exports.postNotebook = async (req, res, next) => {
    try {
        //SELECT * FROM `notebook` WHERE nome_notebook = 'Segundo Notebook'
        var response = await mysql.execute("SELECT * FROM `notebook` WHERE nome_notebook = ?",
            [req.body.nome_notebook]);

        if (response.length > 0) {
            res.status(409).send({
                mensagem: "Notebook com nome ja existente!"
            });
        } else {
            response = await mysql.execute("INSERT INTO `notebook` (`nome_notebook`, `publico`, `avaliacao_media`, `id_usuario`, `criado`) VALUES (?, ?, '0', ?, NOW());",
                [req.body.nome_notebook, req.body.publico, req.usuario.id_usuario]);
            res.status(200).send({
                mensagem: "Notebook criado com sucesso!"
            });
        }

    } catch (error) {

        res.status(500).send({
            error: error,
        });
    }
};


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

exports.getNotebooksUsuario = async (req, res, next) => {
    try {
        //res.status(200).send(req.usuario);

        var response = await mysql.execute("SELECT id_notebook, nome_notebook, publico, avaliacao_media FROM `notebook` WHERE id_usuario = ?",
            [req.usuario.id_usuario]);

        if (response.length > 0) {
            res.status(200).send(response);
        } else {
            res.status(200).send({
                mensagem: "Não há notebooks!"
            });
        }

    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
};

exports.editarNotebook = async (req, res, next) => {
    try {
        //UPDATE `notebook` SET `publico` = '1' WHERE `notebook`.`id_notebook` = 11
        var response = await mysql.execute("SELECT * FROM `notebook` WHERE id_notebook = ?",
            [req.body.id_notebook]);

        if (response.length > 0) {
            if (response[0].nome_notebook == req.body.nome_notebook) {
                response = await mysql.execute("UPDATE notebook SET nome_notebook = ?, publico = ? WHERE notebook.id_notebook = ?",
                    [req.body.nome_notebook, req.body.publico, req.body.id_notebook])
                res.status(200).send({
                    mensagem: "Editado com sucesso!"
                });
            } else {
                response = await mysql.execute("SELECT * FROM `notebook` WHERE nome_notebook = ?",
                    [req.body.nome_notebook]);

                if (response.length > 0) {
                    res.status(409).send({
                        mensagem: "Notebook com nome ja existente!"
                    });
                } else {
                    response = await mysql.execute("UPDATE notebook SET nome_notebook = ?, publico = ? WHERE notebook.id_notebook = ?",
                        [req.body.nome_notebook, req.body.publico, req.body.id_notebook])
                    res.status(200).send({
                        mensagem: "Editado com sucesso!"
                    });
                }
            }


        } else {
            res.status(400).send({
                mensagem: "Notebook não existe!"
            });
        }

    } catch (error) {

        res.status(500).send({
            error: error,
        });
    }
};

exports.excluirNotebook = async (req, res, next) => {
    try {
        //UPDATE `notebook` SET `publico` = '1' WHERE `notebook`.`id_notebook` = 11
        var response = await mysql.execute("SELECT * FROM `notebook` WHERE id_notebook = ?",
            [req.body.id_notebook]);

        if (response.length > 0) {
            response = await mysql.execute("DELETE FROM `notebook` WHERE `notebook`.`id_notebook` = ?",[req.body.id_notebook]);
            res.status(200).send({
                mensagem: "Notebook excluido com sucesso!"
            });

        } else {
            res.status(400).send({
                mensagem: "Notebook não existe!"
            });
        }

    } catch (error) {

        res.status(500).send({
            error: error,
        });
    }
};