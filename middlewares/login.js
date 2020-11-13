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

//===================
//  HTTPS GOOGLE
//===================
let googleMid = (req, res, next) => {
        if (!(process.env.NODE_ENV === "dev")) {
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
    }
    //Exports
module.exports = {
    validacionToken,
    validarRol,
    googleMid
}