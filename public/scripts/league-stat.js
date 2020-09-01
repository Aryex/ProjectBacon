var socket = io.connect();

$(document).ready(() => {
  let playerName = "makinghandties";
  socket.on("ready", (data) => {
    console.log("Ready!");
  });

  socket.emit("getPlayer", playerName, { endIndex: 5, beginIndex: 0 });
  socket.on("getPlayer", (package) => {
    console.log("Got player!");
    console.log(package);
    $("#playerName").text(package.playerAccount.name);

    for (let i = 0; i < package.matches.endIndex; i++) {
      $("#main").append(matchFactory(i));
    }

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

    // socket.emit("getMatches", 0, 10);
    // socket.on("getMatches", (data) => {
    //   console.log(data);
    //   let matches = data;
    //   console.log("Endindex " + matches.endIndex);
    //   let numberOfmatches = 20 < matches.endIndex ? 20 : matches.endIndex;
    //   for (let i = 0; i < numberOfmatches; i++) {
    //     $("#main").append(matchFactory(i));
    //   }
    // });

    // socket.emit("getRankingData");
    // socket.on("getRankingData", (res) => {
    //   let txt;
    //   if (res.code !== 200) {
    //     txt = "Error retrieving Ranked data";
    //     handleErrorHttp(res);
    //   } else {
    //     let data = res.data[0];
    //     let winRate = data.wins / ((data.losses + data.wins) / 100);
    //     txt = data.tier + " " + data.rank + ", " + winRate.toFixed(2) + "%";
    //   }
    //   $("#playerRanking").text(txt);
    // });
  });
});

function handleErrorHttp(res) {
  console.log("ERROR: getRankingData");
  console.log(res.data);
  $("#navBar").after(makeErrorAlert(res.code, res.data));
}

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
