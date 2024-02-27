const {  mongoose } = require("mongoose");
const { user } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("User Generete Authentication Token", () => {
  it("Should return a valid Json", () => {
    const u = {
      _id: new mongoose.Types.ObjectId(1).toHexString(),
      isAdmin: true,
    };

    const users = new user(u);
    const token = users.getAuthToken();
    const playload = jwt.verify(token, config.get("jwtPrivateKey"));

    expect(playload).toMatchObject(u);
  });
});
