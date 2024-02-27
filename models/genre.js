const mongooes = require("mongoose");
const Joi = require("joi");
const Schema = new mongooes.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 5,
    maxlength:50,
  },
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
}

const genres = mongooes.model("genre", Schema);

module.exports.genres = genres;
module.exports.validateGenre = validateGenre;
module.exports.genreSchema = Schema;
