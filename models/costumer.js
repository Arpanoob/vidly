const mongooes = require("mongoose");
const Joi = require("joi");

const Schema = new mongooes.Schema({
  isGold: Boolean,
  name: {
    _id: Object,
    type: String,
    required: true,
    lowercase: true,
    minlength: 5,
    maxlength: 10,
  },
  phone: {
    type: Number,
    minlength: 10,
    maxlength: 10,
    required: true,
    validate: {
      validator: function (v) {
        return v.length === 0;
      },
      message: "must be = 10",
    },
  },
});

function validate(users) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(10).required(),
    phone: Joi.string().length(10).required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(users);
}

const Customer = mongooes.model("Coustomers", Schema);

module.exports.Customer = Customer;
module.exports.validate = validate;
