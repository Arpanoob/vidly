
const request = require("supertest");
const { genres } = require("../../models/genre");
const { user } = require("../../models/user");
const mongoose = require("mongoose");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await genres.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      const genre = [{ name: "genre1" }, { name: "genre2" }];

      await genres.collection.insertMany(genre);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new genres({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(400);
    });

    it("should return 404 if no genre with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    // Define the happy path, and then in each test, we change
    // one parameter that clearly aligns with the name of the
    // test.
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new user().getAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();

      const genre = await genres.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let newName;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new genres({ name: "genre1" });
      await genre.save();

      token = new user().getAuthToken();
      id = genre._id;
      newName = "updatedname";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      newName = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      newName = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if genre with the given id was not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the genre if input is valid", async () => {
      await exec();

      const updatedGenre = await genres.findById(genre._id);

      expect(updatedGenre.name).toBe(newName);
    });

    it("should return the updated genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "updatedname");
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new genres({ name: "genre1" });
      await genre.save();

      id = genre._id;
      token = new user({ isAdmin: true }).getAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new user({ isAdmin: false }).getAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if no genre with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the genre if input is valid", async () => {
      await exec();

      const genreInDb = await genres.findById(id);

      expect(genreInDb).toBeNull();
    });

    it("should return the removed genre", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});



// const request = require("supertest");
// const { genres } = require("../../models/genre");
// const { user } = require("../../models/user");
// const { default: mongoose } = require("mongoose");

// let server;
// describe("/api/genres", () => {
//   beforeEach(async () => {
//     server = require("../../index");
//   });
//   afterEach(async () => {
//     await genres.remove({});
//     server.close();
//   });
//   describe("GET /", () => {
//     it("Should return all genres", async () => {
// //await genres.remove({});

//       await genres.collection.insertMany([
//         { name: "genre1" },
//         { name: "genre2" },
//       ]);
//       //both same genres.insertMany([{ name: "genre1" }, { name: "genre2" }]);

//       const res = await request(server).get("/api/genres");
//       expect(res.status).toBe(200);
//       expect(res.body.length).toBe(2);
//       expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
//     });
//   });
//   describe("GET /:id", () => {
//     it("Should Get Only One Genre With Correct Given Id", async () => {
//       await genres.insertMany([{ name: "genre1" }, { name: "genre2" }]);
//       const genre = await genres.findOne({ name: "genre1" });
//       const id = genre._id;
//       const res = await request(server).get(`/api/genres/${id}`);
//       expect(res.status).toBe(200);
//       //  expect(res.body.length === 1).toBeTruthy();
//       //expect(res.body[0].name).toBe("genre1");
//       expect(res.body).toHaveProperty("name", genre.name);
//     });

//     it("Should Get 400 status Invalid id given", async () => {
//       const res = await request(server).get(`/api/genres/${1}`);
//       expect(res.status).toBe(400);
//     });

//     it("Should Get 404 status Correct id given But  No Item There", async () => {
//       await genres.insertMany([{ name: "genre1" }, { name: "genre2" }]);
//       const genre = await genres.findOne({ name: "genre1" });

//       const res = await request(server).get(
//         "/api/genres/65db780da0041e765425b5b6"
//       );
//       expect(res.status).toBe(404);
//     });
//   });
//   describe("POST /", () => {
//     it("Should return 401 if user is not log in", async () => {
//       const res = await request(server)
//         .post("/api/genres/")
//         .send({ name: "genre1" });
//       expect(res.status).toBe(401);
//     });
//     it("Should return 400 if user is use invalid token log in", async () => {
//       const res = await request(server)
//         .post("/api/genres/")
//         .set("x-auth-token", "in")
//         .send({
//           name: "1234567890",
//         });
//       console.log(res.status);
//       expect(res.status).toBe(400);
//     });
//     it("Should return 200 if user is use valid token log in", async () => {
//       const token = new user().getAuthToken();
//       const res = await request(server)
//         .post("/api/genres/")
//         .set("x-auth-token", token)
//         .send({
//           name: "genre1",
//         });
//       const gene = await genres.findOne({ name: "genre1" });
//       expect(gene).not.toBeNull();
//       expect(res.status).toBe(200);
//     });
//     it("Should return genre if itis valid", async () => {
//       const token = new user().getAuthToken();
//       const res = await request(server)
//         .post("/api/genres/")
//         .set("x-auth-token", token)
//         .send({
//           name: "genre1 ",
//         });
//       expect(res.body).toHaveProperty("_id");
//       expect(res.body).toHaveProperty("name");

//       expect(res.status).toBe(200);
//     });
//     it("Should return 400 if genre name is less than 5 letters", async () => {
//       const token = new user().getAuthToken();
//       const res = await request(server)
//         .post("/api/genres/")
//         .set("x-auth-token", token)
//         .send({
//           name: "12",
//         });
//       console.log(res.status);
//       expect(res.status).toBe(400);
//     });
//     it("Should return 400 if genre name is more than 50 letters", async () => {
//       const token = new user().getAuthToken();
//       const res = await request(server)
//         .post("/api/genres/")
//         .set("x-auth-token", token)
//         .send({
//           // name: "123456789012345678901234567890123456789012345678901",
//           //or
//           name: new Array(52).join("a"),
//           //genrate the sting of 51 char
//         });
//       console.log(res.status);
//       expect(res.status).toBe(400);
//     });
//   });
// });
