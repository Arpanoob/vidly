const config = require("config");
const mongoose = require("mongoose");
const winston = require("winston");

async function db() {
  const db = config.get("dbUri");
  await mongoose.connect(db, {
    family: 4,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  console.log(`Db is connected to ${db}`);
  winston.info(`Db is connected to ${db}`);
}

module.exports = db;
