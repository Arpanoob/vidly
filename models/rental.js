const Joi = require("joi");
const moment = require("moment");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const subSchemaCustomer = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 5,
    maxlength: 10,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const subSchemaMovie = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

const Schema = new mongoose.Schema({
  customer: {
    type: subSchemaCustomer,
    required: true,
  },
  movie: { type: subSchemaMovie, required: true },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: { type: Number, min: 0 },
});
Schema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};
Schema.methods.returns = function () {
  this.dateReturned = Date.now();
  
  this.rentalFee =
    moment().diff(this.dateOut, "days") * this.movie.dailyRentalRate;
};
const model = mongoose.model("rental", Schema);

function validate(rental) {
  const Schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return Schema.validate(rental);
}
module.exports.rental = model;
module.exports.validate = validate;
