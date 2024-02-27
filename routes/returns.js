const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const validateObjectId = require("../middleware/validateObjectId");
const { rental } = require("../models/rental");
const moment = require("moment");
const { movie } = require("../models/movies");
const validate = require("../middleware/validate");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const ren = await rental.lookup(req.body.customerId, req.body.movieId);

  if (!ren) res.status(404).send("Not Found");
  if (ren.dateReturned) res.status(400).send("Date Returned Is Set");
  ren.returns();
  ren.save();
  const m = await movie.findById(req.body.movieId);
  m.numberInStock = m.numberInStock + 1;
  await m.save();

  res.send(ren);
});
function validateReturn(users) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(users);
}
module.exports = router;
