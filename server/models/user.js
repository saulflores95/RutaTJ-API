'use strict'
const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcrypt')

let UserSchema = new Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  hash_password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    default: 'driver'
  },
  companyID: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    default: 52.520007
  },
  longitude: {
    type: Number,
    default: 13.404954
  },
  socketId: {
    type: String
  }
})

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hash_password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User
