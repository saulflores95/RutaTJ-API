const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../models')

const userController = {}

userController.register = (req, res) => {
  let newUser = new db.User(req.body)
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10)
  console.log(newUser);
  console.log(req.body);
  newUser.save((err, user) => {
    console.log(err)
    if (err) {
      return res.status(400).send({
          message: err
      })
    } else {
      user.hash_password = undefined
      return res.json(user)
    }
  })
}

userController.sign_in = function (req, res) {
  console.log('Sign in server...');
  db.User.findOne({
    email: req.body.email
  }, function (err, user){
    if (err) throw err
    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' })
    } else if (user) {
      if (!user.comparePassword(req.body.password)) {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' })
      } else {
        return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') })
      }
    }
  })
}

userController.loginRequired = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' })
  }
}

module.exports = userController
