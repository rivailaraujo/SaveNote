const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
//const bcrypt = require("bcrypt");
const controllerUsuario = require('../controllers/usuario-controller')
const controllerDocumento = require('../controllers/documento-controller')
const login = require("../middleware/login");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString()+ file.originalname);
    }
})
const upload = multer({storage:storage})

router.get("/", login.obrigatorio, controllerUsuario.getUsuario);

router.post("/", controllerUsuario.postUsuario);

router.post("/login", controllerUsuario.loginUsuario);

router.post("/logout", login.obrigatorio, controllerUsuario.logoutUsuario);
//router.post("/teste", login, controllerUsuario.loginUsuario);

router.get("/notebooks", login.obrigatorio , controllerDocumento.getNotebooksUsuario);

router.put("/perfil", login.obrigatorio, upload.single('imagem'), controllerUsuario.editarPerfil)

router.get("/perfil", login.obrigatorio, controllerUsuario.getPerfil);

router.get("/perfilPublico/:id", login.opcional, controllerUsuario.getPerfilPublico);
module.exports = router;