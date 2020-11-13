//Imports
require('../config/config');
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const path = require('path');
//Cuerpo

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use(require('../rutas/index'))
console.log('Servidor Activo')
mongoose.connect(process.env.URI_DB, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log('base de datos Online')
})
mongoose.set('useCreateIndex', true);

//Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

//Listen
app.listen(process.env.PORT);