const https = require("https");

console.log("Hello!");

const options = {
  hostname: "na1.api.riotgames.com",
  method: "GET",
  path: "/lol/summoner/v4/summoners/by-name/makinghandties",
  headers: {
    "X-Riot-Token": "RGAPI-23f201a6-8907-4086-b243-869326f16e1a",
  },
};

// https
//   .get(
//     "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/makinghandties?api_key=RGAPI-23f201a6-8907-4086-b243-869326f16e1a",
//     (res) => {
//       console.log("statusCode: ", res.statusCode);
//       console.log("headers: ", res.headers);

//       res.on("data", function (d) {
//         let content = JSON.parse(d);
//         console.log(content);
//       });
//     }
//   )
//   .on("error", function (e) {
//     console.error(e);
//   });

https
  .get(options, (res) => {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on("data", function (d) {
      let content = JSON.parse(d);
      console.log(content);
    });
  })
  .on("error", function (e) {
    console.error(e);
  });
