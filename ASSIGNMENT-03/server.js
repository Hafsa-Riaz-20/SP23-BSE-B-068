const express = require("express");
let server = express();

server.use(express.static("public"));
server.set("view engine", "ejs");

server.get("/index", (req, res) => {
  res.send(res.render("index"));
});
server.get("/", (req, res) => {
  res.send(res.render("portfolio"));
});

server.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});