const express = require('express');
const { verificaToken } = require('../middlewares/authentication');
const _ = require('underscore');

let app = express();

let Product = require('../models/product');

// =============================
// Obtener todas los productos
// =============================
app.get('/productos', verificaToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({ disponible: true })
        .sort('nombre')
        .skip(from)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Product.countDocuments((err, content) => {
                if (content === 0) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'No existen productos'
                        }
                    });
                }

                res.json({
                    ok: true,
                    products,
                    size: content
                })
            })
        });
});

// =============================
// Obtener producto por id
// =============================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('usuario', 'nombre, email')
        .populate('categoria', 'description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el producto con ese identificador.'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productDB
            });
        });
});

// =============================
// Buscar productos
// =============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Product.find({ nombre: regex })
        .populate('categoria', 'description')
        .exec((err, productsDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productsDB
            });
        })
})

// =============================
// Crear un producto
// =============================
app.post('/productos/', verificaToken, (req, res) => {
    //guardar una categoria del listado
    let body = req.body;

    let product = new Product({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.user._id
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    })
});

// =============================
// Actualizar un producto
// =============================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'disponible']);

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el producto con ese identificador'
                }
            });
        }

        res.json({
            ok: true,
            product: productDb
        });
    });

});

// =============================
// Borrar un producto
// =============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let statusUpdated = {
        disponible: false
    }

    Product.findByIdAndUpdate(id, statusUpdated, { new: true }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no se ha encontrado'
                }
            })
        }

        res.json({
            ok: true,
            product: productDB
        });
    });
});

module.exports = {
    app
}