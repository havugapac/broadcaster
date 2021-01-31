require('dotenv').config();
//const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 200,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: Number,
    min: 0,
    required: true,
  },
  userName: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 200,
    required: true,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({
    _id: this._id, isAdmin: this.isAdmin, firstName: this.firstName, lastName: this.lastName, email: this.email, phoneNumber: this.phoneNumber, userName: this.userName,
  }, process.env.jwtPrivateKey);
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    firstName: Joi.string().min(5).max(50).required(),
    lastName: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(200).required()
      .email(),
    phoneNumber: Joi.number().min(0).required(),
    userName: Joi.string().min(0).required(),
    password: Joi.string().min(5).max(200).required(),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
