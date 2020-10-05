var express = require("express");
const app = express();
const config = require("./config");
const fs = require("fs");
const serveStatic = require("serve-static");

app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: "./" });
});

app.get("/ls", (req, res) => {
  res.sendFile("public/league-stat.html", { root: "./" });
});

app.listen(config.LocalPort, () => {
  console.log("Connected to port: " + config.LocalPort);
});

app.use(express.static("public"));
