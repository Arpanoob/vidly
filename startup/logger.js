require("express-async-errors");
const { default: mongoose } = require("mongoose");
const winston = require("winston");
require("winston-mongodb");
module.exports = () => {
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  const transportOptions = {
    db:process.env.dbUriLog, //async()=> await Promise.resolve(mongoose.connection)(), // Use the Mongoose connection object
    collection: "log",
    level: "info", // Set the minimum logging level (optional)
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json() // Format logs as JSON (optional)
    ),
  };
  winston.add(new winston.transports.MongoDB(transportOptions));
  //this handel unCaught exeption and log it
  //or
  
  process.on("uncaughtException", (ex) => {
    //these are those whi ch are not in rest but not handled like in any line throw new Error()
    console.log("We Got An UnCaught Exception");
    winston.error(ex.message, ex);
    //for good practice for this we need to termonate and resart with clean
    // process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    // //these are those which are generated
    // //by unhandeled promice like promuse have then not catch
    // console.log("UnhandeledRejection");
    // //for good practice for this we need to termonate and resart with clean
    // process.exit(1);

    //or agarhum unhandel promise se jo rejection ka jo exeption aya hain
    // use unhandeled exception banade to  winstone.ExceptionHandler ise lelega
    throw ex;
  });
};
