const express = require('express')
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/authentication');

const app = express();

app.get('/image/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let imgPath = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        let pathNoImg = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathNoImg);
    }
});

module.exports = {
    app
}