const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Product = require('../models/product');

const validTypes = ['products', 'users'];
const validExt = ['png', 'jpg', 'gif', 'jpeg'];

const app = express();

//useTempFiles para que no se suba la imagen vacía
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    //Validar fichero
    validateFile(req, res);

    //Validar tipo
    validateType(tipo, res);

    //Extensiones permitidas
    let file = req.files.file;
    let extName = file.name.split('.');
    let extension = extName[extName.length - 1];
    if (validExt.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + validExt.join(', '),
                ext: extension
            }
        });
    }

    //Cambiar nombre al archivo
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${tipo}/${fileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        switch (tipo) {
            case 'users':
                userImage(id, res, fileName);
                break;
            case 'products':
                productImage(id, res, fileName);
                break;
            default:
                break;
        }
    });
});

function validateFile(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo.'
            }
        });
    }
}

function validateType(tipo, res) {
    if (validTypes.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + validTypes.join(', '),
                tipo
            }
        });
    }
}

function userImage(id, res, fileName) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(fileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            deleteFile(fileName, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = fileName;
        userDB.save((err, userSaved) => {
            res.json({
                ok: true,
                user: userSaved,
                img: fileName
            });
        });
    });
}

function productImage(id, res, fileName) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(fileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            deleteFile(fileName, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = fileName;
        productDB.save((err, productSaved) => {
            res.json({
                ok: true,
                product: productSaved,
                img: fileName
            });
        });
    });
}

function deleteFile(fileName, tipo) {
    let imgPath = path.resolve(__dirname, `../../uploads/${tipo}/${fileName}`);

    if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
    }
}

module.exports = {
    app
}