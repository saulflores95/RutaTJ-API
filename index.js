const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const db = require('./server/models')
const userController = require('./server/controllers/userController')
const routeController = require('./server/controllers/routeController')
const jwt = require('jsonwebtoken')
const cors = require('cors')
app.use(cors())
//Database connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/rutatj', { useMongoClient: true }, () => {
  console.log('Connected to mongodb...')
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', (err, decode) => {
      if (err) req.user = undefined
      req.user = decode
      next()
    })
  } else {
    req.user = undefined
    next()
  }
})

app.get('/api', (req, res) => {
  res.json({
    text: 'Bienvenido a el API de RutaTJ'
  })
  console.log(req.user)
})

app.post('/api/register', userController.register)

app.post('/api/login', userController.sign_in)

app.get('/api/protected', userController.loginRequired, (req, res) => {
  res.json({
    description: 'Protected information. Congrats!'
  })
})

app.get('/api/routes', routeController.get)

app.post('/api/routes', userController.loginRequired, routeController.post)

app.listen(8080, () => {
  console.log('App activated on port 8080')
})
