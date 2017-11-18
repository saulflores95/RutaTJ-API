const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)
const port = parseInt(process.env.PORT, 10) || 8080
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
//Mock data and socket io integration START
let drivers = [
  {
    username: 'Fred',
    socketId: 123,
    latitude: 35.44,
    longitude: -122.34
  }
]
let count = 0
//  socket.io server
io.on('connection', socket => {
  count++
  io.sockets.emit('broadcast', count + ' people online')
  socket.emit('drivers', drivers)
  socket.on('new-user', user => {
    let filter = drivers.filter(driver => driver.socketId === socket.id)
    console.log('New User', user.username)
    if (filter.length === 0) {
      let driver = {
        socketId: socket.id,
        username: user.username,
        coords: user.coords
      }
      drivers.push(driver)
      io.sockets.emit('drivers', drivers)
    } else {
      console.log('User logged in')
    }
  })
  socket.on('remove-driver', data => {
    drivers = drivers.filter(driver => {
      return driver.socketId !== data
    })
    io.sockets.emit('drivers', drivers)
  })
  socket.on('update-user-position', data => {
    // let filter = drivers.filter(driver => driver.socketId === user.socketId)
    let index = drivers.findIndex(driver => driver.socketId === data.socketId)
    if (drivers[index] === undefined) {
      return 0
    } else {
      drivers[index].coords = data.coords
      console.log(drivers[index].latitude)
      console.log(`Updated Sucess: ${drivers[index].username} - Cords: ${drivers[index].coords[0]} -  ${drivers[index].coords[1]}`)
    }
    io.sockets.emit('drivers', drivers)
  })
  socket.on('disconnect', function (data) {
    count--
    io.sockets.emit('broadcast', count + ' people online')
  })
})


app.get('/api', userController.loginRequired, (req, res) => {
  res.json({
    text: 'Welcome to the api'
  })
})

app.get('/api/user', (req, res) => {
  res.json({
    user: req.user
  })
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

app.put('/api/update-user-position', userController.updatePosition)

server.listen(port, () => {
  console.log(`App activated on port ${port}`)
})
