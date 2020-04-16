const express = require('express')

const app = express()

app.use(require('./users').app)
app.use(require('./login').app)

module.exports = {
    app
}