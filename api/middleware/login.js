const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) => {
    
    try {
        const token = req.headers.authorization.split(' ')[1];
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