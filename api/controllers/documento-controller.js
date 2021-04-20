const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const crypto = require('crypto')
//INSERT INTO `notebook` (`nome_notebook`, `publico`, `avaliacao_media`, `id_usuario`, `criado`) VALUES ('', '', '0', '', '');

exports.postNotebook = async (req, res, next) => {
    try {
        //SELECT * FROM `notebook` WHERE nome_notebook = 'Segundo Notebook'
        var response = await mysql.execute("SELECT * FROM `notebook` WHERE nome_notebook = ? AND id_usuario = ?",
            [req.body.nome_notebook, req.usuario.id_usuario]);

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
        var response = await mysql.execute("SELECT caminho FROM `anotacao`, notebook WHERE anotacao.id_notebook = notebook.id_notebook AND notebook.id_usuario = ? AND anotacao.id_notebook = ? AND id_anotacao = ?",
        [req.usuario.id_usuario, req.params.id_notebook, req.params.id_anotacao]);
        
        data = req.body;

        //console.log(data)
        //var fs = require('fs');
        //console.log(data)
        fs.writeFile(response[0].caminho, data.txt, function (erro) {

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
    var response = await mysql.execute("SELECT caminho FROM `anotacao`, notebook WHERE anotacao.id_notebook = notebook.id_notebook AND notebook.id_usuario = ? AND anotacao.id_notebook = ? AND id_anotacao = ?",
    [req.usuario.id_usuario, req.params.id_notebook, req.params.id_anotacao]);

    try {


        fs.readFile(response[0].caminho, 'utf8', function (err, data) {
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

exports.getDocumentoPublico = async (req, res, next) => {
    var response = await mysql.execute("SELECT caminho FROM `anotacao`, notebook WHERE anotacao.id_notebook = notebook.id_notebook AND anotacao.id_notebook = ? AND id_anotacao = ?",
    [req.params.id_notebook, req.params.id_anotacao]);

    try {


        fs.readFile(response[0].caminho, 'utf8', function (err, data) {
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

exports.getNotebooks = async (req, res, next) => {
    try {
        //res.status(200).send(req.usuario);

        var response = await mysql.execute("SELECT id_notebook, nome_notebook, avaliacao_media, imagem, nome AS 'autor' FROM notebook, usuario WHERE publico = 1 AND notebook.id_usuario = usuario.id_usuario",
            []);

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
            response = await mysql.execute("DELETE FROM `anotacao` WHERE id_notebook = ?;",
            [req.body.id_notebook]);
            
            response = await mysql.execute("DELETE FROM `notebook` WHERE `notebook`.`id_notebook` = ?",
            [req.body.id_notebook]);
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

exports.postAnotacao = async (req, res, next) => {

    try {
        //SELECT * FROM `notebook` WHERE nome_notebook = 'Segundo Notebook'
        var response = await mysql.execute("SELECT * FROM `anotacao` WHERE nome_anotacao = ? AND id_notebook = ?",
            [req.body.nome_anotacao, req.body.id_notebook]);

        if (response.length > 0) {
            res.status(409).send({
                mensagem: "Anotação com nome ja existente!"
            });
        } else {

            response = await mysql.execute("SELECT * FROM `notebook` WHERE id_usuario = ? AND id_notebook = ?",
            [req.usuario.id_usuario, req.body.id_notebook]);

            if (response.length < 0){
                res.status(500).send({
                    mensagem: "Notebook nao pertence ao usuario",
                });
            }else{
                var hash = crypto.randomBytes(20).toString('hex');
            fs.writeFile("./txts/"+hash+".txt", "Bem Vindo a sua nova anotação", function (erro) {

                if (erro) {
                    throw erro;
                }
                console.log("Arquivo salvo");
                return res.status(200).send({
                    mensagem: 'salvo',
                });
            });

            response = await mysql.execute("INSERT INTO `anotacao` (`id_notebook`, `nome_anotacao`, `caminho`, `criado`) VALUES (?, ?, './txts/"+hash+".txt', NOW());",
                [req.body.id_notebook, req.body.nome_anotacao]);
            res.status(200).send({
                mensagem: "Notebook criado com sucesso!"
            });
            }
            
        }

    } catch (error) {

        res.status(500).send({
            error: hash,
        });
    }
};

exports.getNotebook = async (req, res, next) => {
    try {
        //res.status(200).send(req.usuario);

        var response = await mysql.execute("SELECT nome_notebook, publico, avaliacao_media FROM `notebook` WHERE id_usuario = ? AND id_notebook = ?",
            [req.usuario.id_usuario, req.params.id]);

        if (response.length > 0) {
            res.status(200).send(response);
        } else {
            res.status(200).send({
                mensagem: "Não há notebook!"
            });
        }

    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
};

exports.getNotebookPublico = async (req, res, next) => {
    try {
        //res.status(200).send(req.usuario);

        var response = await mysql.execute("SELECT nome_notebook, publico, nome AS 'autor', avaliacao_media FROM `notebook`, `usuario` WHERE id_notebook = ? AND notebook.id_usuario = usuario.id_usuario",
            [req.params.id]);

        if (response.length > 0) {
            res.status(200).send(response);
        } else {
            res.status(200).send({
                mensagem: "Não há notebook!"
            });
        }

    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
};

exports.getAnotacoesUsuario = async (req, res, next) => {
    try {
        //res.status(200).send(req.usuario);

        var response = await mysql.execute("SELECT id_anotacao, nome_anotacao, caminho FROM `anotacao`, notebook WHERE anotacao.id_notebook = notebook.id_notebook AND notebook.id_usuario = ? AND anotacao.id_notebook = ?",
            [req.usuario.id_usuario, req.params.id]);

        if (response.length > 0) {
            res.status(200).send(response);
        } else {
            res.status(200).send({
                mensagem: "Não há Anotações!"
            });
        }

    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
};

exports.getAnotacoesUsuarioPublica = async (req, res, next) => {
    try {
        //res.status(200).send(req.usuario);

        var response = await mysql.execute("SELECT id_anotacao, nome_anotacao, caminho FROM `anotacao`, notebook WHERE anotacao.id_notebook = notebook.id_notebook AND anotacao.id_notebook = ?",
            [req.params.id]);

        if (response.length > 0) {
            res.status(200).send(response);
        } else {
            res.status(200).send({
                mensagem: "Não há Anotações!"
            });
        }

    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
};


exports.excluirAnotacao = async (req, res, next) => {
    try {
        //UPDATE `notebook` SET `publico` = '1' WHERE `notebook`.`id_notebook` = 11
        var response = await mysql.execute("SELECT * FROM `anotacao` WHERE id_anotacao = ?",
            [req.body.id_anotacao ]);

        if (response.length > 0) {
            response = await mysql.execute("DELETE anotacao FROM anotacao INNER JOIN notebook ON anotacao.id_notebook = notebook.id_notebook  WHERE notebook.id_notebook = ? AND notebook.id_usuario = ? AND anotacao.id_anotacao = ?",
            [req.body.id_notebook, req.usuario.id_usuario, req.body.id_anotacao]);
            res.status(200).send({
                mensagem: "Anotacao excluido com sucesso!"
            });

        } else {
            res.status(400).send({
                mensagem: "Anotacão não existe!"
            });
        }

    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
};