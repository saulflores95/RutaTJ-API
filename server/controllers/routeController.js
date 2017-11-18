const db = require('../models')
const rutas = require('../../rutas.json')
const routeController = {}

routeController.post = (req, res) => {
  let newRoute = new db.Route(req.body)
  console.log(newRoute);
  newRoute.save((err, route) => {
    if (err) {
      console.log(err)
      return res.status(400).send({
        message: err
      })
    } else {
      return res.json(route)
    }
  })
}

routeController.get = (req, res) => {
  return res.status(200).send(rutas)
}

routeController.getAll = (req, res) => {
  db.Route.find({}).populate({
    path: '_creator', //this has to be removed
    select: 'username createdAt -_id' //this has to be changed
  }).then((route) => {
    return res.status(200).json({
      succes: true,
      data: route
    })
  }).catch((err) => {
    return res.status(500).json({
      message: err
    })
  })
}

module.exports = routeController
