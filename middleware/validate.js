module.exports = function validate(validateReturn) {
  return function (req, res, next) {
    const { error } = validateReturn(req.body);
    if (error) res.status(400).send(error.details[0].message);
    next();
  };
};
