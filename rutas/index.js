//Imports
const express = require('express');
const app = express();

//Cuerpo
app.use(require('./login'));
app.use(require('./users'));

//Export
module.exports = app;