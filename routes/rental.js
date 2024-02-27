const express = require("express");
const assert = require("assert");
const auth = require("../middleware/auth");

const router = express.Router();
const { Customer } = require("../models/costumer");
const { rental, validate } = require("../models/rental");
const { movie } = require("../models/movies");
const { db } = require("../models/db");
const { default: mongoose } = require("mongoose");

router.get("/", (req, res) => {
  const rentals = rental.find().sort("-dateOut");
  res.send(rentals);
});
router.post("/", auth, async (req, res) => {
  const session = await mongoose.startSession();
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.message);

  const customers = await Customer.findById(req.body.customerId);
  if (!customers) return res.status(400).send("Customer Not Found");
  const movies = await movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Movie Not Found");

  if (movies.numberInStock === 0)
    return res.status(400).send("Movie Out Of Stock");
  await session.withTransaction(async () => {
    const addable = new rental({
      customer: {
        _id: customers._id,
        name: customers.name,
        phone: customers.phone,
      },
      movie: {
        _id: movies._id,
        title: movies.title,
        dailyRentalRate: movies.dailyRentalRate,
      },
    });

    const result = await movie
      .updateOne(
        {
          _id: req.body.movieId,
        },
        {
          $inc: {
            numberInStock: -1,
          },
        }
      )
      .session(session)
      .exec();
    //assert.ok(result.modifiedCount == 1);
    if(!result.modifiedCount==1)throw Error("Some thing Weired Happend")
    await addable.save({ session });

  });
  await session.endSession();
  res.send("Successfull ");
});
router.put("/", (req, res) => {});
router.delete("/", (req, res) => {});

module.exports = router;
