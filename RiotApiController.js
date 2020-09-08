var socketio = require("socket.io");
var riot = require("./RiotApi.js");
var fs = require("fs");
var io;

// var playerAcc, playerAccId, playerSumId;
var playerAccount;
var championsEntries;
exports.start = (server, config) => {
  io = socketio.listen(server);
  riot.start(config.ApiKey);
  //Prepare Champion data

  io.sockets.on("connection", (socket) => {
    console.log("connection");
    socket.emit("ready", "This is Player Hello!");
    handleCommand(socket);
  });
};

function handleCommand(socket) {
  console.log("Api ready");
  let playerAcc = {};

  socket.on("getPlayer", (name, matchQueryRange) => {
    let package = {};
    console.log("getting player " + name);
    riot
      .request(gameVersions())
      .then((res) => {
        package.gameVersion = res.data[0];
        return riot.request(playerByName(name));
      })
      .then((res) => {
        package.playerAccount = { ...res.data };
        playerAccount = { ...res.data };
        return riot.request(rankingBySumId(package.playerAccount.id));
      })
      .then((res) => {
        package.playerRanking = { ...res.data[0] };
        return riot.request(
          matchListByAccId(
            package.playerAccount.accountId,
            matchQueryRange.endIndex,
            matchQueryRange.beginIndex
          )
        );
      })
      .then((res) => {
        let matchList = res.data;
        let matchesPromiseArray = new Array();
        matchList.matches.forEach((match) => {
          console.log("Gameid: " + match.gameId);
          matchesPromiseArray.push(
            riot.request(matchByGameId(match.gameId)).then((res) => {
              return res.data;
            })
          );
        });
        return Promise.all(matchesPromiseArray);
      })
      .then((matches) => {
        /* 
        PROCESSING MATCHES INTO PACKAGE
        Participant id 1 to 5 is blue side
        */
        matches.forEach((match) => {
          console.log(match);
          //Find Player id in match
          let playerIdentity = match.participantIdentities.find(
            (identity) => identity.player.accountId == playerAccount.accountId
          );
          match.playerPId = playerIdentity.participantId;

          //Process Match information
          match.playerTeam = playerIdentity.participantId <= 5 ? 100 : 200;
          let playerTeamIndex = match.playerTeam / 100 - 1;
          match.playerWin =
            match.teams[playerTeamIndex].win === "Win" ? true : false;
        });

        package.matchList = { endIndex: matchQueryRange.endIndex, matches };
      })
      .then(() => {
        /* 
        Package Sent
        */
        console.log("SENDING TO CLIENT");
        console.log(package);
        fs.writeFile("package.json", JSON.stringify(package), (err) => {
          console.log("PACK WRITE ERROR");
          console.log(err);
        });
        socket.emit("getPlayer", package);
      })
      .catch((rejects) => console.log(rejects));
  });
}

function getChampionName(championId) {
  fs.readFileSync("./public/data/champion.json", (err, data) => {
    if (err) console.log(err);
    entries = Object.entries(JSON.parse(data).data);
    for (const [champion, data] of entries) {
      if (data.key == championId) {
        return champion;
      }
    }
  });
}

let obj = {
  participantId: 10,
  teamId: 200,
  championId: 223,
  spell1Id: 6,
  spell2Id: 4,
  stats: {
    champLevel: 15,
    win: false,
    item0: 3075,
    item1: 3047,
    item2: 3068,
    item3: 3065,
    item4: 0,
    item5: 0,
    item6: 3340,
    kills: 4,
    deaths: 6,
    assists: 9,
    totalMinionsKilled: 157,
    visionWardsBoughtInGame: 2,
    wardsPlaced: 5,
    wardsKilled: 2,
    perk0: 8437,
    perk0Var1: 1184,
    perk0Var2: 1152,
    perk0Var3: 0,
    perk1: 8401,
    perk1Var1: 187,
    perk1Var2: 0,
    perk1Var3: 0,
    perk2: 8444,
    perk2Var1: 1541,
    perk2Var2: 0,
    perk2Var3: 0,
    perk3: 8242,
    perk3Var1: 84,
    perk3Var2: 0,
    perk3Var3: 0,
    perk4: 8345,
    perk4Var1: 3,
    perk4Var2: 0,
    perk4Var3: 0,
    perk5: 8410,
    perk5Var1: 118,
    perk5Var2: 0,
    perk5Var3: 0,
    perkPrimaryStyle: 8400,
    perkSubStyle: 8300,
    statPerk0: 5005,
    statPerk1: 5002,
    statPerk2: 5001,
  },
};
