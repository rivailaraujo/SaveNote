const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
//const bcrypt = require("bcrypt");
const controllerUsuario = require('../controllers/usuario-controller')

router.get("/", controllerUsuario.getUsuarios);

router.post("/", controllerUsuario.postUsuario);

module.exports = router;