const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postUsuario = async (req, res, next) => {
    try {

        var response = await mysql.execute(
            "SELECT * FROM usuario WHERE email = ? AND nome = ?;",
            [req.body.email, req.body.nome]
        );
        if (response.length > 0) {
            return res.status(401).send({
                mensagem: "Nome e Email ja cadastrado",
            });
        }

        response = await mysql.execute(
            "SELECT * FROM usuario WHERE email = ?;",
            [req.body.email]
        );
        if (response.length > 0) {
            return res.status(401).send({
                mensagem: "Email ja cadastrado",
            });
        }

        response = await mysql.execute(
            "SELECT * FROM usuario WHERE nome = ?;",
            [req.body.nome]
        );
        if (response.length > 0) {
            return res.status(401).send({
                mensagem: "Nome de usuário ja cadastrado",
            });
        } else {
            const hash = await bcrypt.hashSync(req.body.senha, 10);

            await mysql.execute(
                "INSERT INTO usuario (nome, imagem, email, senha, cidade, estado, criado) VALUES(?,'web/public/img', ?, ?, ?, ?, NOW());",
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
                    expiresIn: "1h",
                }
            );
            await mysql.execute(
                "INSERT INTO sessao (id_usuario, token, data_expiracao, expirado, criado, atualizado) VALUES (?, ?, NULL, 0, NOW(), NULL);",
                [response[0].id_usuario, token]
            );
            return res.status(200).send({
                mensagem: "Login feito com sucesso",
                token: token
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