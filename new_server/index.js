// start server
// connect to Riot API.
// request scheduler.
// Start polling according to limit rate.
// put into mongodb.
// create basic route endpoint.
const express = require("express");
const RiotApi = require("./RiotApi.js");

const app = express();
const port = 8080;

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });

console.log("Starting");

const Scheduler = require("./scheduler.js");
require("./RiotApi");

let riotApi = new RiotApi("RGAPI-28f9ea4e-7bbb-44aa-a0ec-0191a6423c5c");
riotApi.getPlayerAccByName("MakingHandties").then((res) => {
  console.log(res);
});

// const scheduler = new Scheduler(2, 1000, 0);
// for (let index = 0; index < 6; index++) {
//   scheduler.enqueue(
//     (msg) => {
//       console.log(msg);
//     },
//     ["Hello!"]
//   );
// }
// for (let index = 0; index < 6; index++) {
//   scheduler.enqueue(
//     (msg) => {
//       console.log(msg);
//     },
//     ["Hello!"]
//   );
// }
