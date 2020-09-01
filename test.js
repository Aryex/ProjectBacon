const { match } = require("assert");

riot = require("./RiotApi");
config = require("./config");

let name = "makinghandties",
  beginIndex = 0;
endIndex = 5;

riot.start(config.ApiKey);
let package = {};
// let playerAccount = {};
console.log("getting player " + name);
riot
  .request(playerByName(name))
  .then((res) => {
    package.playerAccount = { ...res.data };
    return riot.request(rankingBySumId(package.playerAccount.id));
  })
  .then((res) => {
    package.playerRanking = { ...res.data[0] };
    return riot.request(
      matchListByAccId(package.playerAccount.accountId, beginIndex, endIndex)
    );
  })
  // .then((res) => {
  //   let matchList = res.data;
  //   let matchesPromiseArray = new Array();
  //   matchList.matches.forEach((match) => {
  //     console.log("Gameid: " + match.gameId);
  //     matchesPromiseArray.push(
  //       riot.request(matchByGameId(match.gameId)).then((res) => {
  //         return res.data;
  //       })
  //     );
  //   });
  //   return Promise.all(matchesPromiseArray);
  // })
  // .then((matches) => {
  //   // console.log(matches[0].participantIdentities);
  //   matches.forEach((match) => {
  //     let identity = match.participantIdentities.find(
  //       (identity) => identity.player.accountId == playerAccount.accountId
  //     );
  //     console.log(identity);
  //     match.playerPId = identity.participantId;
  //     // participant id 1 to 5 is blue side
  //     match.playerTeam = identity.participantId <= 5 ? 100 : 200;
  //     let teamIndex = match.playerTeam / 100;
  //     match.playerWin = match.teams[teamIndex - 1].win;
  //     // console.log(match);
  //   });
  //   package.matches = matches;

  //   // matches.forEach((match) => {
  //   //   let player = match.participantIdentities.find(
  //   //     (indentity) => indentity.player.name === name
  //   //   );
  //   //   console.log(player);
  //   // });
  // })
  .then(() => {
    console.log("SENDING TO CLIENT");
    console.log(package);
    socket.emit("getPlayer", package);
  })
  .catch((rejects) => console.log(rejects));
return;
riot
  .request(playerByName(name))
  .then((res) => {
    package.playerAccount = { ...res.data };
    playerAccount = { ...res.data };
    return riot.request(rankingBySumId(package.playerAccount.id));
  })
  .then((res) => {
    package.playerRanking = { ...res.data[0] };
    console.log(package);
    return riot.request(
      matchListByAccId(package.playerAccount.accountId, endIndex, beginIndex)
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
      let identity = match.participantIdentities.find(
        (identity) => identity.player.accountId == playerAccount.accountId
      );
      console.log(identity);
      match.playerPId = identity.participantId;
      // participant id 1 to 5 is blue side
      match.playerTeam = identity.participantId <= 5 ? 100 : 200;
      let teamIndex = match.playerTeam / 100;
      match.playerWin = match.teams[teamIndex - 1].win;
      // console.log(match);
    });

    console.log("OUT SIDE!");

    package.matches = matches;

    console.log(package.matches[2].participants[7]);
    console.log(package.matches[3].participants[0]);
    console.log(package.matches[4].participants[4]);
  });

/* 

Respond {
  code: 200,
  data: {
    gameId: 3551689892,
    platformId: 'NA1',
    gameCreation: 1598500430254,
    gameDuration: 1592,
    queueId: 400,
    mapId: 11,
    seasonId: 13,
    gameVersion: '10.16.330.9186',
    gameMode: 'CLASSIC',
    gameType: 'MATCHED_GAME',
    teams: [ [Object], [Object] ],
    participants: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    participantIdentities: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ]
  }
}
*/
