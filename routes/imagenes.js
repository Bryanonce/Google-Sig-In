//Imports
const express = require('express');;
const app = express();
const fs = require('fs');
const path = require('path');
const verificaTokenImg = require('../middlewares/login').verificaTokenImg;

//Cuerpo
app.get('/imagen/:img', verificaTokenImg, (req, res) => {
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../uploads/covid/${img}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
    }
})

//Exports
module.exports = app