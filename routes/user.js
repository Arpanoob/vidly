const express = require("express");
const router = express.Router();
const { validate, user } = require("../models/user");
const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const admin = require("../middleware/admin");

router.get("/me", auth, async (req, res) => {
  const users = await user.findById(req.user._id).select(["-password", "-__v"]);
  res.send(users);
});
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send("Errorr : " + error.details[0].message);

  let users = await user.findOne({ email: req.body.email });
  if (users) return res.status(400).send("Already Exist");
  let use = new user(
    _.pick(req.body, ["name", "email", "password", "isAdmin"])
  );
  const salt = await bcrypt.genSalt(10);
  const hashedPasswordd = await bcrypt.hash(use.password, salt);
  use.password = hashedPasswordd;
  await use.save();
  const token = use.getAuthToken();
  res
    .header("x-auth-header", token)
    .send(_.pick(use, ["_id", "name", "email"]));
});
router.delete("/:id", [auth, admin], async (req, res) => {
  const users = await user.deleteOne({ id: req.params.id });
  if (!users)
    return res.status(404).send("The user with the given ID was not found.");
  res.status(200).send(users);
});

module.exports = router;
