//Imports
require('../config/config');
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const path = require('path');
//Cuerpo



app.use(require('../routes/index'))
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