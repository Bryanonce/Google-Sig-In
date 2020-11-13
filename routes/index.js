//Imports
const express = require('express');
const app = express();

//Cuerpo
app.use(require('./login'));
app.use(require('./users'));
app.use(require('./upload'));
app.use(require('./imagenes'));

//Export
module.exports = app;