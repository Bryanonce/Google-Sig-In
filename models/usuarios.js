//Imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

//Interfaces
let tiposValidos = {
    values: ['ACCESO_RECURSOS', 'ESTUDIANTES'],
    message: '{VALUE} no es un rol válido'
}

//Cuerpo
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Se necesita el nombre']
    },
    email: {
        type: String,
        required: [true, 'Se necesita el email'],
        unique: true
    },
    pass: {
        type: String,
        required: [true, 'Se necesita el pass']
    },
    tipo: {
        type: String,
        default: 'ESTUDIANTES',
        enum: tiposValidos
    },
    activo: {
        type: Boolean,
        default: false
    },
    googleSin: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.pass;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} ya se encuentra registrado'
})

//Exports
module.exports = mongoose.model('Users', usuarioSchema);