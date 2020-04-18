// ===============================
// Verificar token
// ===============================
const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401)
                .json({
                    ok: false,
                    err: {
                        message: 'Token no válido'
                    }
                })
        }
        req.user = decoded.user;
        next();
    })
};

// ===============================
// Verificar ADMIN_ROLE
// ===============================

let verificaAdminRole = (req, res, next) => {
    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401)
            .json({
                ok: false,
                err: {
                    message: 'El usuario no tiene es Administrador'
                }
            })
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}