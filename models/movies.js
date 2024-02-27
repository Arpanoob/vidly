const mongoose = require("mongoose");

const { genreSchema } = require("./genre");

const Joi = require("joi");

const Schema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 255 },
  genre: genreSchema,
  numberInStock: { type: Number, required: true, min: 0, max: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
});

function validate(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required,
    dailyRentalRate: Joi.number().min(0).required(),
  });
  schema.validate(movie);
}

const movie = mongoose.model("movie", Schema);

module.exports.movie = movie;
module.exports.validate = validate;
