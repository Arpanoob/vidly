const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  await res.sendFile("./routes.txt", { root: __dirname }, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(err.status).end();
    } else {
      console.log("File sent successfully");
    }
  });
});
module.exports = router;
