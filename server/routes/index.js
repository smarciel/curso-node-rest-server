const express = require('express')

const app = express()

app.use(require('./users').app)
app.use(require('./category').app)
app.use(require('./product').app)
app.use(require('./login').app)
app.use(require('./upload').app)
app.use(require('./images').app)

module.exports = {
    app
}