//Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');
const validacionToken = require('../middlewares/login').validacionToken;
const validarRol = require('../middlewares/login').validarRol;

//Cuerpo
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/users', [validacionToken, validarRol], (req, res) => {
    Usuario.find({})
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.json({
                ok: true,
                usuarios
            })
        })
})

app.post('/users', /*[validacionToken, validarRol],*/ (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        email: body.email,
        pass: bcrypt.hashSync(body.pass, 10),
        tipo: body.tipo,
        nombre: body.nombre
    })
    usuario.save((err, usuarioDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDb
        })
    })
})

//Exports
module.exports = app;