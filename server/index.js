require('dotenv').config();
const express = require("express");

const PORT = process.env.PORT;

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello Josh, from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});