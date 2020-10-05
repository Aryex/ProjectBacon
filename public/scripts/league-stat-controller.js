var socket = io.connect("http://10.0.0.194:8080");

$(document).ready(() => {
  let playerName = "makinghandties";
  socket.on("ready", (data) => {
    console.log("Ready!");
  });

  socket.emit("getPlayer", playerName, { endIndex: 5, beginIndex: 0 });
  socket.on("getPlayer", (package) => {
    console.log("Got player!");
    console.log(package);
    let dDragon = DDragon.getInstance(package.gameVersion);
    let playerAccount = package.playerAccount;
    $("#playerName").text(package.playerAccount.name);
    $("#playerLevel").text("Level " + package.playerAccount.summonerLevel);
    $(".player-icon-wrapper").prepend(
      $('<img src="' + dDragon.iconCdn(playerAccount.profileIconId) + '">')
    );

    let matchList = package.matchList;
    let $matchHistory = $(".match-history");
    /* 
    Creating Match History
     */
    let championData, summData, runesData;
    fetch(dDragon.championDataCdn())
      .then((res) => res.json())
      .then((data) => {
        championData = data;
        return fetch(dDragon.summDataCdn());
      })
      .then((res) => res.json())
      .then((json) => {
        summData = json;
        return fetch(dDragon.runesDataCdn());
      })
      .then((res) => res.json())
      .then((data) => {
        runesData = data;
        return fetch(dDragon.itemsDataCdn());
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        itemsData = data;
        for (let i = 0; i < matchList.endIndex; i++) {
          // let playerPId = matchList.matches[i].playerPId;
          // let champId =
          //   matchList.matches[i].participants[playerPId - 1].championId;
          // playerChampionData = findChampionData(entries, champId);
          $matchHistory.append(
            createMatch(
              matchList.matches[i],
              championData,
              summData,
              runesData,
              itemsData
            )
          );
        }
      })

      .catch((rej) => {
        console.log(rej);
      });

    let txt;
    let rankingData = package.playerRanking;
    let winRate =
      rankingData.wins / ((rankingData.losses + rankingData.wins) / 100);
    txt =
      rankingData.tier +
      " " +
      rankingData.rank +
      ", " +
      winRate.toFixed(2) +
      "%";
    $("#playerRanking").text(txt);
  });
});

function handleErrorHttp(res) {
  console.log("ERROR: getRankingData");
  console.log(res.data);
  $("#navBar").after(makeErrorAlert(res.code, res.data));
}

/* 
Data Dragon CDN generator;
*/

/* 
HTTP Error Factory
*/

function makeErrorAlert(code, errorMsg) {
  let msg = "code " + code + " from Riot API, " + errorMsg;
  let $closeBtn = $(
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
  ).append('<span aria-hidden="true">&times;</span>');

  return $('<div role="alert" style="text-align: center">')
    .addClass("alert alert-danger alert-dismissible fade show")
    .append($("<strong>Error: </strong>"))
    .append(msg)
    .append($closeBtn);
}

function matchFactory(i) {
  // Champ icon
  let $champIcon = $("<div>")
    .append(
      $("<img>")
        .addClass("champ-icon rounded-circle")
        .attr("src", "resources/irelia.jpg")
    )
    .append(
      $('<p style="text-align: center; margin-top: 5px;"">').text("Irelia")
    );

  let $Result = $("<div>")
    .addClass("container-inline ml-5 vertical-middle")
    .append($("<h1>").text("Victory"))
    .append($("<hr>").addClass("my-2"))
    .append($("<h5>").text("Ranked Solo/Duo"))
    .append($("<h5>").text("32 min"));

  let $KDA = $("<div>")
    .addClass("container-inline ml-5 vertical-middle justify-content-center")
    .append($("<h2>").text("0 / 0 / 0"))
    .append(
      $("<div>")
        .addClass("container justify-content-center")
        .append($("<img>").attr("src", "resources/flash.jpg").width("30px"))
        .append($("<img>").attr("src", "resources/ignite.jpg").width("30px"))
    );

  let $Stats = $("<div>")
    .addClass("container-inline ml-5 vertical-middle")
    .append("<h5>CS: 231 (6.4)</h5>")
    .append("<h5>KP: 31%</h5>")
    .append("<h5>DShare: 41%</h5>")
    .append("<h5>DPS: 41%</h5>");

  return $("<div></div>")
    .addClass(
      "match-container d-flex flex-row shadow-noshadow p-3 bg-primary rounded"
    )
    .append($champIcon)
    .append($Result)
    .append($KDA)
    .append($Stats);
}
