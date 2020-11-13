//Imports
const express = require('express');
const app = express()
const Usuario = require('../models/usuarios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTE_GOOGLE);
//const googleMid = require('../middlewares/login').googleMid;
//Cuerpo
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay match',
                err
            });
        };
        if (!usuarioDb) {
            return res.status(401).json({
                ok: false,
                msg: 'No existe',
                err
            });
        };
        if (!bcrypt.compareSync(body.pass, usuarioDb.pass)) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay match',
                err
            });
        };
        let token = jwt.sign({ usuarioDb }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN })
        res.json({
            ok: true,
            token: token
        });
    });
});

//GOOGLE CONFIG
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTE_GOOGLE
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    return {
        nombre: payload.name,
        email: payload.email,
        google: true
    }
}
//verify().catch(console.error);

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch((err) => {
            return res.status(403).json({
                ok: false,
                message: 'Hemos perdido :(',
                err: err
            })
        })
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (usuarioDb) {
            if (usuarioDb.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: {
                        desc: 'Debe utilizar su auth normal',
                        error: err
                    }
                });
            } else {
                let token = jwt.sign({ usuarioDb }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDb,
                    token
                });
            };
        } else {
            //SI EL USER NO EXISTE
            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                google: true,
                pass: ':)'
            });
            usuario.save((err, usuarioDb) => {
                let token = jwt.sign({ usuarioDb }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDb,
                    token
                });
            })
        }

    })

    /*res.json({
        usuario: googleUser
    })*/
})

//Exports
module.exports = app