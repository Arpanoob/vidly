const express = require("express");
const app = express();

require("./startup/env")();
require("./startup/logger")();
require("./startup/validation")();
require("./startup/routes")(app, express);
require("./startup/config")();

require("./models/db")();

require("./startup/prod")(app);

const config = require("config");

const port = process.env.PORT || 3000;
module.exports = app.listen(port, () => {
  console.log(`Environment : ${process.env.NODE_ENV} `);
  console.log(`Listening on port ${port}...`);
});
