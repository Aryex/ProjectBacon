const https = require("https");
var socketio = require("socket.io");
var io;

// var playerAcc, playerAccId, playerSumId;
var playerAccount;

exports.listen = (server) => {
  io = socketio.listen(server);

  io.sockets.on("connection", (socket) => {
    console.log("connection");
    socket.emit("ready", "This is Player Hello!");
    handleCommand(socket);
  });
};

function handleCommand(socket) {
  console.log("Api ready");

  socket.on("getPlayer", (name) => {
    console.log("getPlayer");
    makeRequest(getPlayerByName(name), (data) => {
      playerName = data.name;
      playerAccId = data.accountId;
      playerSumId = data.id;
      playerAccount = { ...data };
      console.log(playerAccount);
      socket.emit("getPlayer", playerAccount.name);
    });
  });

  socket.on("getRankingData", (data) => {
    console.log("getRanking");
    makeRequest(getPlayerRankingData(), (data) => {
      console.log("GET RANKING");
      console.log(data);
    });
  });

  socket.on("getMatches", () => {
    console.log("getMatches");
    makeRequest(getMatches(), (matches) => {
      //console.log(matches);
      socket.emit("getMatches", matches);
    });
  });
}

function makeRequest(req, callback) {
  console.log(req);
  https
    .get(req, (res) => {
      console.log(res.headers);
      let dataChunks = "";
      res.on("data", (chunk) => {
        dataChunks += chunk;
      });

      res.on("end", () => {
        let data = JSON.parse(dataChunks);
        // console.log("data " + data);
        if (callback != null) {
          callback(data);
        }
      });
    })
    .on("error", function (e) {
      console.error(e);
    });
}

/* 
Option factories
*/
function options(path) {
  return {
    hostname: "na1.api.riotgames.com",
    method: "GET",
    path: path,
    headers: {
      "X-Riot-Token": "RGAPI-29ae54ff-35ab-4ba9-a961-2dfb60698732",
    },
  };
}

function getPlayerByName(name) {
  return options("/lol/summoner/v4/summoners/by-name/" + name);
}

function getMatches() {
  return options(
    "/lol/match/v4/matchlists/by-account/" + playerAccount.accountId
  );
}

function getPlayerRankingData() {
  console.log(playerSumId);
  return options("/lol/league/v4/entries/by-summoner/" + playerAccount.id);
}
