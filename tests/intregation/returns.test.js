const { mongoose } = require("mongoose");
const { rental } = require("../../models/rental");
const request = require("supertest");
const { user } = require("../../models/user");
const moment = require("moment");
const { movie } = require("../../models/movies");

describe("/api/returns/", () => {
  let server;
  let rentals;
  let customerId;
  let movieId;
  let token;
  let movies;
  beforeEach(async () => {
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new user().getAuthToken();
    server = require("../../index");
    movies = new movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 10,
      genre: {
        name: "12345",
      },
      numberInStock: 10,
    });
    await movies.save();
    rentals = new rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "1234567890",
      },
      movie: {
        _id: movieId,
        title: "Iron-",
        dailyRentalRate: 10,
      },
    });
    await rentals.save();
  });
  afterEach(async () => {
    await rental.remove({});
    await server.close();
  });
  const exce = () =>
    request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });

  it("Should return the 401 status if client is not logged in", async () => {
    token = "";
    const res = await exce();
    expect(res.status).toBe(401);
  });
  it("Should return the 400 status if client not pass movie id ", async () => {
    customerId = "";
    const res = await exce();
    expect(res.status).toBe(400);
  });
  it("Should return the 400 status if client not pass customerId", async () => {
    movieId = "";
    const res = await exce();
    expect(res.status).toBe(400);
  });
  it("Should return the 404 status no rental found for customerID and movieId", async () => {
    await rental.remove({});
    const res = await exce();
    expect(res.status).toBe(404);
  });
  it("Should return the 400 status rental found have return date set", async () => {
    await rental.updateOne(
      {
        "customer._id": customerId,
        "movie._id": movieId,
      },
      {
        $set: {
          dateReturned: Date.now(),
        },
      }
    ); // rentals.dateReturned = Date.now();
    const res = await exce();
    expect(res.status).toBe(400);
  });
  it("Should return the 200 status for valid request", async () => {
    const res = await exce();
    expect(res.status).toBe(200);
  });
  it("Should return date if input is valid ", async () => {
    const res = await exce();
    const rentalindb = await rental.findById(rentals._id);
    const dateObject = rentalindb.dateReturned.toISOString();
    expect(res.body.dateReturned).toBe(dateObject);
  });
  it("Should return ren with rental fee ", async () => {
    rentals.dateOut = moment().add(-7, "days").toDate();
    await rentals.save();

    const res = await exce();
    const rentalInDb = await rental.findById(rentals._id);
    expect(rentalInDb.rentalFee).toBe(70);
  });
  it("Should increase the numberInStock of movies by one", async () => {
    const res = await exce();
    const m = await movie.findById(movies._id);
    expect(m.numberInStock).toBe(movies.numberInStock + 1);
  });
  it("Should return tental object", async () => {
    const res = await exce();
    const rentalInDb = await rental.findById(rentals._id);
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
