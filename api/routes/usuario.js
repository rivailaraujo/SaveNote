const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
//const bcrypt = require("bcrypt");
const controllerUsuario = require('../controllers/usuario-controller')
const controllerDocumento = require('../controllers/documento-controller')
const login = require("../middleware/login");

router.get("/", login.obrigatorio, controllerUsuario.getUsuario);

router.post("/", controllerUsuario.postUsuario);

router.post("/login", controllerUsuario.loginUsuario);

router.post("/logout", login.obrigatorio, controllerUsuario.logoutUsuario);
//router.post("/teste", login, controllerUsuario.loginUsuario);

router.get("/notebooks", login.obrigatorio , controllerDocumento.getNotebooksUsuario);

module.exports = router;