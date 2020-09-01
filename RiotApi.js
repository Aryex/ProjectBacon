const https = require("https");

var ApiKey;

exports.start = (key) => {
  ApiKey = key;
};

exports.request = function (req) {
  return new Promise((success, reject) => {
    https
      .get(req, (res) => {
        console.log("Respond status code: " + res.statusCode);
        let statusCode = res.statusCode;
        let dataChunks = "";
        res.on("data", (chunk) => {
          dataChunks += chunk;
        });

        res.on("end", () => {
          let data = JSON.parse(dataChunks);
          let dataWrapper;
          if (res.statusCode != 200) {
            console.log("ERROR");
            console.log("PATH:" + req.path);
            console.log(data);
            dataWrapper = new Respond(statusCode, data.status.message);
            if (reject != null) reject(dataWrapper);
          } else {
            dataWrapper = new Respond(statusCode, data);
          }
          if (success != null) success(dataWrapper);
        });
      })
      .on("error", (e) => {
        reject(dataWrapper);
        console.error(e);
      });
  });
};

/* 
Data object
*/
function Respond(code, data) {
  this.code = code;
  this.data = data;
}

/* 
Global HTTPS option factories
*/
function options(path) {
  return {
    hostname: "na1.api.riotgames.com",
    method: "GET",
    path: path,
    headers: {
      "X-Riot-Token": ApiKey,
    },
  };
}

global.option = function (path) {
  return options(path);
};

global.matchByGameId = (gameId) => {
  return options("/lol/match/v4/matches/" + gameId);
};

global.playerByName = function (name) {
  return options("/lol/summoner/v4/summoners/by-name/" + name);
};

global.matchListByAccId = function (accountId, endIndex, beginIndex) {
  let path = "/lol/match/v4/matchlists/by-account/" + accountId;
  if (beginIndex != undefined) {
    path += "?beginIndex=" + beginIndex;
    if (endIndex != undefined) {
      path += "&endIndex=" + endIndex;
    }
  } else if (endIndex != undefined) {
    path += "?endIndex=" + endIndex;
  }

  // console.log(path);

  return options(path);
};

// Get player match histories by summonerId
global.rankingBySumId = function (summonerId) {
  return options("/lol/league/v4/entries/by-summoner/" + summonerId);
};
