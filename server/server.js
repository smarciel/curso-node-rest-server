const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./config/config.js')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(require('./routes/users').app)

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

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ' + process.env.PORT);
})