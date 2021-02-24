const jwt = require('jsonwebtoken');
const mysql = require("../mysql");

exports.obrigatorio = async (req, res, next) => {
    
    try {

        const token = req.headers.authorization.split(' ')[1];
        const response = await mysql.execute(
            "SELECT * FROM `sessao` WHERE token = ? AND expirado = 1",
            [token]
        );
        console.log(response)
        if (response.length > 0) {
            return res.status(401).send({
                mensagem: "Falha na autenticação jwt, token expirado",
            });
        }
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.usuario = decode;
        req.token = token;
        next();
    } 
    
    catch (error) {
        return res.status(401).send({
            mensagem: "Falha na autenticação jwt, token inválido"
        });
    }
}
exports.opcional = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.usuario = decode;
        next();
    } catch (error) {
        next();
    }
}