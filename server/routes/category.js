const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaAdminRole } = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');

// =========================
// Mostrar todas las categorias
// =========================
app.get('/categoria', (req, res) => {
    let limit = req.query.limit || 5;
    limit = Number(limit);

    Category.find()
        .sort('description')
        .populate('user', 'nombre email') //para mostrar los datos del usuario correspondiente a esa receta (esquema user y campos que se quieran)
        .limit(limit)
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Category.countDocuments((err, content) => {
                res.json({
                    ok: true,
                    categories,
                    size: content
                })
            })
        });

});

// =========================
// Mostrar una categoria por identificador
// =========================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe.'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
});

// =========================
// Crear una nueva categoria 
// =========================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: categoryDB
        });
    })
});

// =========================
// Actualizar una nueva categoria 
// =========================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategory = {
        description: body.description
    }

    Category.findByIdAndUpdate(id, descCategory, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// =========================
// Eliminar una nueva categoria 
// =========================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe.'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoría borrada'
        });
    })
});

module.exports = {
    app
}