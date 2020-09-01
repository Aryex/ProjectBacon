var socketio = require("socket.io");
var riot = require("./RiotApi.js");
const { emit } = require("process");
var io;

// var playerAcc, playerAccId, playerSumId;
var playerAccount;

exports.start = (server, config) => {
  io = socketio.listen(server);
  riot.start(config.ApiKey);

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
      .request(playerByName(name))
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
        // console.log(matches[0].participantIdentities);
        matches.forEach((match) => {
          console.log(match);
          let identity = match.participantIdentities.find(
            (identity) => identity.player.accountId == playerAccount.accountId
          );
          match.playerPId = identity.participantId;
          // participant id 1 to 5 is blue side
          match.playerTeam = identity.participantId <= 5 ? 100 : 200;
          let teamIndex = match.playerTeam / 100;
          match.playerWin = match.teams[teamIndex - 1].win;
          // console.log(match);
        });

        package.matches = { endIndex: matchQueryRange.endIndex, matches };

        // matches.forEach((match) => {
        //   let player = match.participantIdentities.find(
        //     (indentity) => indentity.player.name === name
        //   );
        //   console.log(player);
        // });
      })
      .then(() => {
        console.log("SENDING TO CLIENT");
        console.log(package);
        socket.emit("getPlayer", package);
      })
      .catch((rejects) => console.log(rejects));

    //socket.emit("getPlayer", playerAccount.name);
  });

  // socket.on("getPlayer", (name) => {
  //   console.log("getPlayer");
  //   riot.request(playerByName(name), (res) => {
  //     playerAccount = { ...res.data };
  //     console.log(playerAccount);
  //     socket.emit("getPlayer", playerAccount.name);
  //   });
  // });

  // socket.on("getRankingData", (data) => {
  //   riot.request(rankingBySumId(playerAccount.id), (res) => {
  //     console.log("getRankingData responded");
  //     if (res.code !== 200) {
  //       console.log("ERROR CODE: " + res.code);
  //     }
  //     console.log(res.data);
  //     socket.emit("getRankingData", res);
  //   });
  // });

  // socket.on("getMatches", (beginIndex, endIndex) => {
  //   console.log("getMatches");
  //   let matchList;
  //   riot.request(
  //     matchListByAccId(playerAccount.accountId, beginIndex, endIndex),
  //     (res) => {
  //       matchList = { ...res.data };

  //       socket.emit("getMatches", matchList);
  //       /*
  //       Emits matches.
  //       */
  //     }
  //   );

  //   console.log(matchList);
  // });
}
