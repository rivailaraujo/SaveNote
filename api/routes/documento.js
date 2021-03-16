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


module.exports = router;