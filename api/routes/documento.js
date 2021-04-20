const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
//const bcrypt = require("bcrypt");
const controllerDocumento = require('../controllers/documento-controller')
const login = require("../middleware/login");

//router.post("/", login.obrigatorio, controllerDocumento.postDocumento);
router.post("/", controllerDocumento.postDocumento);
router.post("/notebook", login.obrigatorio , controllerDocumento.postNotebook);
router.get("/", controllerDocumento.getDocumento);
router.get("/notebooks",login.opcional, controllerDocumento.getNotebooks);
router.put("/notebook", login.obrigatorio , controllerDocumento.editarNotebook);
router.delete("/notebook", login.obrigatorio , controllerDocumento.excluirNotebook);
router.post("/anotacao", login.obrigatorio , controllerDocumento.postAnotacao);
router.get("/notebook/:id",login.opcional, controllerDocumento.getNotebook);
router.get("/anotacoesUsuario/:id", login.obrigatorio , controllerDocumento.getAnotacoesUsuario);
router.delete("/anotacao", login.obrigatorio , controllerDocumento.excluirAnotacao);
module.exports = router;