const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.postUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query(
            "SELECT * FROM usuario WHERE email = ?",
            [req.body.email],
            (error, resultado, field) => {
                if (error) {
                    conn.release();
                    return res.status(500).send({
                        error: error,
                        response: null,
                    });
                }
                if (resultado.length > 0) {
                    conn.release();
                    return res.status(409).send({
                        mensagem: "Usuario Já Cadastrado",
                    });
                } else {
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if (errBcrypt) {
                            return res.status(500).send({
                                error: errBcrypt,
                            });
                        }
                        conn.query(
                            "INSERT INTO usuario (nome, imagem, email, senha, cidade, estado, criado) VALUES(?,'web/public/img', ?, ?, ?, ?, NOW())",
                            [req.body.nome, req.body.email, hash, req.body.cidade, req.body.estado],
                            (error, resultado, field) => {
                                conn.release();

                                if (error) {
                                    return res.status(500).send({
                                        error: error,
                                        response: null,
                                    });
                                }
                                return res.status(201).send({
                                    mensagem: "Usuario inserido com sucesso",
                                    id_usuario: resultado.insertId,
                                });
                            }
                        );
                    });
                }

            }
        );

    });
}

exports.loginUsuario = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        const query = "SELECT * FROM usuario WHERE email = ?";
        conn.query(query, [req.body.email], (error, resultado, field)  => {
            conn.release();

            if (error) {
                return res.status(500).send({
                    error: error,
                    response: null,
                });
            }

            if(resultado.length < 1){
                return res.status(401).send({
                    mensagem: "Falha na autenticação"
                });
            }

            bcrypt.compare(req.body.senha, resultado[0].senha, (err, result) => {
                if(err){
                    return res.status(401).send({
                        mensagem: "Falha na autenticação"
                    });
                };
                if(result){
                    
                    let token = jwt.sign({
                        id_usuario: resultado[0].id_usuario,
                        email: resultado[0].email
                    }, process.env.JWT_KEY,{expiresIn: "1h"});

                    conn.query("INSERT INTO sessao (id_usuario, token, data_expiracao, expirado, criado, atualizado) VALUES (?, ?, NULL, 0, NOW(), NULL)", 
                    [resultado[0].id_usuario, token], (error, result, field)  => {
                        conn.release();
                        if (error) {
                            console.log(resultado[0].id_usuario, token);
                            res.status(500).send({
                                
                                error: error,
                                response: null,
                            });
                        }

                    });
                    

                    return res.status(200).send({
                        mensagem: "Autenticado com sucesso",
                        token: token
                    });
                    
                };
                return res.status(401).send({
                    mensagem: "Falha na autenticação"
                });
            })

            
            
            //res.status(201).send(resultado);
        });
    });
}

exports.logoutUsuario = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        const query = "UPDATE sessao SET data_expiracao = NOW(), expirado = 1 WHERE sessao.token = ?;";
        conn.query(query, [req.token], (error, resultado, field)  => {
            conn.release();

            if (error) {
                return res.status(500).send({
                    error: error,
                    response: null,
                });
            }

            if(resultado){
                return res.status(401).send({
                    mensagem: "Logout feito com sucesso"
                });
            }        //res.status(201).send(resultado);
        });
    });
}

exports.getUsuarios = (req, res, next) => {
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
            });
        }
        conn.query("SELECT * FROM `usuario`", (error, resultado, field) => {
            conn.release();

            if (error) {
                res.status(500).send({
                    error: error,
                    response: null,
                });
            }
            res.status(201).send(resultado);
        });
    });
}