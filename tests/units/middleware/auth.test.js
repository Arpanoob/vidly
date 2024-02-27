const { user } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const { default: mongoose } = require("mongoose");

describe("authMiddleware", () => {
  it("Should populate req.user with the payload of a valid jwt", () => {
    const users = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new user(users).getAuthToken();
    req = { header: jest.fn().mockReturnValue(token) };
    const res = {};
    const next = jest.fn();
    auth(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject(users);
  });
});
