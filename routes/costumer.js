const express = require("express");
const router = express.Router();

const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const { Customer, validate } = require("../models/costumer");

router.get("/", async (req, res) => {
  try {
    const result = await Customer.find();
    if (!result) res.status(404).send("Not Found");
    res.send(result);
  } catch (e) {
    res.send(500).send("Error", e.message);
  }
});
router.post("/", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);
    const customer = {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    };
    const user = new Customer(customer);
    user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await Customer.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});
router.delete("/:id", [auth, admin], async (req, res) => {
  const user = await Customer.deleteOne({ _id: req.params.id });
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.status(200).send(user);
});

router.get("/:id", async (req, res) => {
  const user = await Customer.find({ _id: req.params.id });
  if (!user)
  return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});

module.exports = router;
