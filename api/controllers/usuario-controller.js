const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");

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
                    res.status(500).send({
                        error: error,
                        response: null,
                    });
                }
                if (resultado.length > 0) {
                    conn.release();
                    res.status(409).send({
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
                                    res.status(500).send({
                                        error: error,
                                        response: null,
                                    });
                                }
                                res.status(201).send({
                                    mensagem: "Usuario inserido com sucesso",
                                    id_produto: resultado.insertId,
                                });
                            }
                        );
                    });
                }

            }
        );

    });
}

exports.getUsuarios = (req, res, next) => {
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