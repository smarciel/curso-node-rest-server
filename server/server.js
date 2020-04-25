const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
require('./config/config.js')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

//Configuracion de rutas
app.use(require('./routes/index').app)

mongoose.connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) {
        throw err;
    }
    console.log('Base de datos online');
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ' + process.env.PORT);
})