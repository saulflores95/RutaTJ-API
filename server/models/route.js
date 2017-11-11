'use strict'
const mongoose = require('mongoose')
const { Schema } = mongoose

let RouteSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  direccion: String,
  longitud: {
    type: Number,
    required: true
  },
  latitud: {
    type: Number,
    required: true
  },
  imgUrl: {
    type: String,
    default: ''
  },
  companyID: {
    type: String,
    required: true
  }
})

const Route = mongoose.model('Route', RouteSchema)

module.exports = Route
