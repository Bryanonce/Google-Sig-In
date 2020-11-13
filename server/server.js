//Imports
require('../config/config');
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const path = require('path');
//Cuerpo


/*app.use(function(req, res, next) {
    if (process.env.NODE_ENV === "production") {
        const reqType = req.headers["x-forwarded-proto"];
        // if not https redirect to https unless logging in using OAuth
        if (reqType !== "https") {
            req.url.indexOf("auth/google") !== -1 ?
                next() :
                res.redirect("https://" + req.headers.host + req.url);
        }
    } else {
        next();
    }
});*/

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