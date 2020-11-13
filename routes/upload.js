//Imports
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuarios');
const fs = require('fs');
const path = require('path');

//Cuerpo
app.use(fileUpload());

app.put('/upload/:id', (req, res) => {
    let id = req.params.id;
    Usuario.findById(id)
        .exec((err, usuarioDb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error en la conexión',
                    err
                });
            };
            if (!usuarioDb) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se encontró el usuario',
                    err
                });
            };
            //Path de la img
            borrArchivo(usuarioDb.img);
            //Guardar en Server
            if (!req.files) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se ha seleccionado ningún archivo'
                    }
                })
            }
            console.log('........')
            let archivo = req.files.archivo;
            let nombreCortado = archivo.name.split('.');
            let extension = nombreCortado[nombreCortado.length - 1];
            console.log(extension);

            //Extensiones permitidas
            let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

            if (extencionesValidas.indexOf(extension) < 0) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        extencion: extension,
                        message: `Las extensiones permitidas son: ${extencionesValidas}`,
                    }
                })
            }

            //Cambiar nombre al archivo
            let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

            archivo.mv(`uploads/covid/${nombreArchivo}`, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    message: 'Imagen Subida',
                    img: nombreArchivo
                })
            });
            usuarioDb.img = nombreArchivo
            usuarioDb.save((err, usuarioDb) => {
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

        });
});

let borrArchivo = (nombreImagen) => {
    let pathImg = path.resolve(__dirname, `../uploads/covid/${nombreImagen}`);
    console.log(pathImg);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
};
//Exports
module.exports = app