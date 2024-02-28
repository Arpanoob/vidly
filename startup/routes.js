const genres = require("../routes/genres");
const coustomer = require("../routes/costumer");
const movie = require("../routes/movies");
const users = require("../routes/user");
const auth = require("../routes/auth");
const rental = require("../routes/rental");
const error = require("../middleware/error");
const returns = require("../routes/returns");
const start = require("../routes/start");
module.exports = (app, express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // not all should protected app.use(auth()); so route
  // me daldia jisko authorzation kerwana hian
 app.use("/",start);
  app.use("/api/genres", genres);
  app.use("/api/customer", coustomer);
  app.use("/api/movies", movie);
  app.use("/api/rentals", rental);
  app.use("/api/user", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);

  //koi error ayi to to vo rest next() kerke is middleware
  // pe aajaiga fir ye error function jo
  //maine banaya hain vo us error ko console kerdega or bhej bhi dega
  app.use(error);
};
