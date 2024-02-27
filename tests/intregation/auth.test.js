const { genres } = require("../../models/genre");
const { user } = require("../../models/user");
const request = require("supertest");
describe("authMiddleWare", () => {
  let token = "";
  let server;
  beforeEach(() => {
    server = require("../../index");
    token = new user().getAuthToken();
  });
  const exce = async () => {
    return await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };
  afterEach(async () => {
    await genres.remove({});
    await server.close();
  });

  it("Should Return 401 status is token not provided", async () => {
    token = "";
    const res = await exce();
    expect(res.status).toBe(401);
  });
  it("Should Return 401 status is token not provided", async () => {
    token = "a";
    const res = await exce();
    expect(res.status).toBe(400);
  });
  it("Should Return 401 status is token not provided", async () => {
    token = "a";
    const res = await exce();
    expect(res.status).toBe(400);
  });
  it("Should Return 200 status is token not provided", async () => {
    const res = await exce();
    expect(res.status).toBe(200);
  });
});
