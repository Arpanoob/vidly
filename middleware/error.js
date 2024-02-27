const winston = require("winston");

function error(ex, req, res, next) {
  //ex vo error hain jo rest ke cath block me hoga fir hue bhejdega
  winston.error(error.message, ex);
  if (ex) res.status(500).send("SomeThing Failed " + ex + ex.message);
  next();
}

module.exports = error;
