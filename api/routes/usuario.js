const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            "SELECT * FROM `usuario`",
            (error, resultado, field) => {
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: 'GET USUARIO',
                });
            }
        )
    });
});

router.post('/', (req, res, next) => {
        mysql.getConnection((error, conn) => {
            conn.query(
                "INSERT INTO usuario (username, img, email, password, create_time) VALUES (?,'web/public/img', ?, ?, NOW())",
                [req.body.nome, req.body.email, req.body.senha],
                (error, resultado, field) => {
                    conn.release();

                    if(error){
                        res.status(500).send({
                            error: error,
                            response: null
                        });
                    }
                    res.status(201).send({
                        mensagem: 'Usuario inserido com sucesso',
                        id_produto: resultado.insertId
                    });
                }
            )
        });
    });

module.exports = router;