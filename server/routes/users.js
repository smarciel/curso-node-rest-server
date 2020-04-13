const express = require('express')
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express()

app.get('/usuario', function(req, res) {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ estado: true }, 'nombre email role estado google img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({ estado: true }, (err, content) => {
                res.json({
                    ok: true,
                    users,
                    size: content
                })
            })
        });
})

app.post('/usuario', function(req, res) {
    let body = req.body;

    let user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: userDB
        });
    })
})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: userDB
        });
    });
})

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let statusUpdated = {
        estado: false
    }

    User.findByIdAndUpdate(id, statusUpdated, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El usuario no se ha encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: userDB
        });
    });
})

module.exports = {
    app
}