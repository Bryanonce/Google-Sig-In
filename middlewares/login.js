//Imports
const jwt = require('jsonwebtoken');

//===================
//  Validar Token
//===================
let validacionToken = (req, res, next) => {
    let token = req.get('token-request')
    if (!token) {
        return res.status(403).json({
            ok: false,
            message: 'token no encontrado'
        })
    }
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(403).json({
                ok: false,
                description: 'token muerto',
                message: err
            });
        };
        req.usuario = decode.usuarioDb;
        next()
    })
}

//===================
//  Validar Rol
//===================
let validarRol = (req, res, next) => {
    let role = req.usuario.tipo;
    if (!(role === 'ACCESO_RECURSOS')) {
        return res.status(401).json({
            ok: false,
            description: 'Área restringida'
        })
    }
    next();

}


//Exports
module.exports = {
    validacionToken,
    validarRol
}