const express = require("express");
const router = express.Router();
const { user } = require("../models/user");
const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send("Error " + error.details[0].message);

  let users = await user.findOne({ email: req.body.email });
  if (!users) return res.status(400).send("Invalid Email or Password");

  const validPassword = bcrypt.compare(req.body.password, users.password);
  if (!validPassword) return res.status(400).send("Invalid Email or Password");

  const tocken = users.getAuthToken();

  res.send(tocken);
});
function validate(userr) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(userr);
}

module.exports = router;
