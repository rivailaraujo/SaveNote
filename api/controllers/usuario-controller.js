const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.postUsuario = async (req, res, next) => {
    try {



        var response = await mysql.execute(
            "SELECT * FROM usuario WHERE email = ?;",
            [req.body.email]
        );
        if (response.length > 0) {
            return res.status(401).send({
                mensagem: "Email ja cadastrado",
                code: 001
            });
        }

        response = await mysql.execute(
            "SELECT * FROM usuario WHERE nome = ?;",
            [req.body.nome]
        );
        if (response.length > 0) {
            return res.status(401).send({
                mensagem: "Nome de usuário ja cadastrado",
                code: 100
            });
        } else {
            const hash = await bcrypt.hashSync(req.body.senha, 10);

            await mysql.execute(
                "INSERT INTO usuario (nome, email, senha, cidade, estado, criado) VALUES(?, ?, ?, ?, ?, NOW());",
                [req.body.nome, req.body.email, hash, req.body.cidade, req.body.estado])

            return res.status(201).send({
                mensagem: "Usuario inserido com sucesso",
                //id_usuario: resultado.insertId,
            });

        }
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
};

exports.loginUsuario = async (req, res, next) => {
    try {
        const response = await mysql.execute(
            "SELECT * FROM usuario WHERE email = ?;",
            [req.body.email]
        );
        if (response.length < 1) {
            return res.status(401).send({
                mensagem: "Falha na autenticação",
            });
        }
        if (await bcrypt.compareSync(req.body.senha, response[0].senha)) {
            const token = jwt.sign({
                    id_usuario: response[0].id_usuario,
                    email: response[0].email,
                },
                process.env.JWT_KEY, {
                    expiresIn: "24h",
                }
            );
            await mysql.execute(
                "INSERT INTO sessao (id_usuario, token, data_expiracao, expirado, criado, atualizado) VALUES (?, ?, NULL, 0, NOW(), NULL);",
                [response[0].id_usuario, token]
            );

            return res.status(200).send({
                mensagem: "Login feito com sucesso",
                token: token,
                expiresIn: 24
            });
        } else {
            return res.status(401).send({
                mensagem: "Falha na autenticação",
            });
        }
    } catch (error) {
        return res.status(401).send({
            mensagem: "Falha na autenticação",
        });
    }
};

exports.logoutUsuario = async (req, res, next) => {
    try {
        await mysql.execute("UPDATE sessao SET data_expiracao = NOW(), expirado = 1 WHERE sessao.token = ?;",
            [req.token]);

        return res.status(200).send({
            mensagem: "Logout feito com sucesso",
        });
    } catch (error) {

        res.status(500).send({
            error: error,
        });
    }
};

exports.getUsuarios = async (req, res, next) => {
    try {
        const response = await mysql.execute("SELECT * FROM usuario;");
        res.status(201).send(response);
    } catch (error) {

        res.status(500).send({
            error: error,
        });
    }
};

exports.getUsuario = async (req, res, next) => {
    try {
        const response = await mysql.execute("SELECT nome,imagem,email FROM `usuario` WHERE id_usuario = ?",
            [req.usuario.id_usuario]);
        res.status(200).send(response);
    } catch (error) {

        res.status(500).send({
            error: error,
        });
    }
};

exports.editarPerfil = async (req, res, next) => {
    console.log(req.file)
    try {
        if (req.file == undefined) {
            var response = await mysql.execute(
                "UPDATE `usuario` SET `nome` = ?,`cidade` = ?, `estado` = ? WHERE `usuario`.`id_usuario` = ?",
                [req.body.nome, req.body.cidade, req.body.estado, req.usuario.id_usuario]
            );
            return res.status(200).send({
                mensagem: "Alteração feita com sucesso!",
                //id_usuario: resultado.insertId,
            });
        } else {
            var response = await mysql.execute(
                "UPDATE `usuario` SET `nome` = ?, `imagem` = ?,`cidade` = ?, `estado` = ? WHERE `usuario`.`id_usuario` = ?",
                [req.body.nome, 'http://localhost:3000/' + req.file.path, req.body.cidade, req.body.estado, req.usuario.id_usuario]
            );
            return res.status(200).send({
                mensagem: "Alteração feita com sucesso!",
                //id_usuario: resultado.insertId,
            });
        }
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
};