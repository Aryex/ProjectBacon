var matchWinColor = { header: "#6c9ffd", body: "#a8c5fc" };
var matchLoseColor = { header: "#ff5252", body: "#ff8f8f" };
let championEntries, summEntries, itemEntries;
let dominationTree, precisionTree, resolveTree, sorceryTree, inspirationTree;
let dDragon;

function createMatch(match, championData, summData, runesData, itemsData) {
  championEntries = Object.entries(championData.data);
  summEntries = Object.entries(summData.data);
  itemEntries = Object.entries(itemsData.data);
  dominationTree = runesData[0];
  inspirationTree = runesData[1];
  precisionTree = runesData[2];
  resolveTree = runesData[3];
  sorceryTree = runesData[4];
  dDragon = DDragon.getInstance();

  let playerStat = match.participants[match.playerPId - 1].stats;
  let playerItems = [
    playerStat.item0,
    playerStat.item1,
    playerStat.item2,
    playerStat.item3,
    playerStat.item4,
    playerStat.item5,
  ];
  let playerTrinket = playerStat.item6;

  $header = $('<div class="match-header">')
    .append("<div>" + getDate(match.gameCreation) + "</div>")
    .append("<div>" + secToMin(match.gameDuration) + "</div>")
    .append("<div>Avg rating: TBD</div>");

  // Creating body
  $body = $('<div class="match-body rounded-bottom p-1">')
    .append($matchResult(match))
    .append($pickDetail(match))
    .append($stats(playerStat, Math.round(match.gameDuration / 60)))
    .append(
      $playerBuild(
        playerItems,
        playerTrinket,
        playerStat.visionWardsBoughtInGame
      )
    )
    .append($teams(match));

  setColor($body, $header, match.playerWin);

  return $('<div class="match-wrapper">').append($header).append($body);
}

function secToMin(sec) {
  remainder = sec % 60;
  return Math.floor(sec / 60) + "m " + remainder + "s";
}

function getDate(time) {
  let date = new Date(time);
  return (
    getMothnString(date.getMonth()) +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear()
  );
}

function getMothnString(month) {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "Febuary";
    case 2:
      return "Marh";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "NaN";
  }
}
function setColor($body, $header, playerWin) {
  if (playerWin) {
    $body.css("background-color", matchWinColor.body);
    $header.css("background-color", matchWinColor.header);
  } else {
    $body.css("background-color", matchLoseColor.body);
    $header.css("background-color", matchLoseColor.header);
  }
}

/* 
TEAM

note: riot lane and role data are CALCULATED. Sometimes, their values does not make sense. 
In such cases, the odering cannot be preserved. 
*/
function $teams(match, playerId) {
  console.log(match);
  let blueTeam = new Array(),
    redTeam = new Array();
  let error = false;

  console.log("game id: " + match.gameId);

  match.participants.forEach((participant) => {
    // Blue team has id <= 5
    let team;
    let participantName =
      match.participantIdentities[participant.participantId - 1].player
        .summonerName;
    let _isPlayer = participant.participantId == playerId;

    let teamMember = {
      name: participantName,
      image: findChampionData(participant.championId).image,
      isPlayer: _isPlayer,
    };

    if (participant.participantId <= 5) {
      team = blueTeam;
      console.log("Blue team:");
    } else {
      team = redTeam;
      console.log("Red team:");
    }

    console.log("LANE " + participant.timeline.lane);

    switch (participant.timeline.lane) {
      case "TOP":
        team[0] = { ...teamMember };
        break;
      case "JUNGLE":
        team[1] = { ...teamMember };
        break;
      case "MIDDLE":
        team[2] = { ...teamMember };
        break;
      case "BOTTOM":
        if (participant.timeline.role == "DUO_CARRY") {
          team[3] = { ...teamMember };
        } else {
          team[4] = { ...teamMember };
        }
        break;
      default:
        error = true;
        team.push({ ...teamMember });
        break;
    }
  });

  console.log("BLUE: ");
  // console.log(blueTeam[0].image);
  blueTeam.forEach((player) => {
    console.log(player);
  });
  console.log("RED: ");
  redTeam.forEach((player) => {
    console.log(player.image);
  });

  $teamBlue = $('<div class"team-blue>');
  for (i = 0; i < 5; i++) {
    $teamBlue.append($teamMember(blueTeam[i]));
  }

  $teamRed = $('<div class"team-red>');
  for (i = 0; i < 5; i++) {
    $teamRed.append($teamMember(redTeam[i]));
  }

  return $('<div class="teams-wrapper">').append($teamBlue).append($teamRed);
}

function $teamMember(player) {
  $champIcon = $('<div class="champ-icon">').css({
    "background-image":
      "url(" + dDragon.getTinySpriteCdn(player.image.sprite) + ")",
    "background-position":
      (-player.image.x / 2) * 0.75 +
      "px " +
      (-player.image.y / 2) * 0.75 +
      "px ",
  });
  return $('<div class="team-member">')
    .append($champIcon)
    .append('<div class="text">' + player.name + "</div>");
}

function $matchResult(match) {
  return $("<div>")
    .addClass("match-result")
    .append(
      '<div class="win-text">' +
        (match.playerWin ? "Victory" : "Defeat") +
        "</div>"
    )
    .append('<hr class="my-1" />')
    .append($queueType(match.queueId));
}

function $queueType(id) {
  let $div = $('<div class="type-text">');
  switch (id) {
    case 400:
      $div.text("Draft");
      break;
    case 420:
      $div.text("Ranked Solo");
      break;
    case 430:
      $div.text("Blind");
      break;
    case 440:
      $div.text("Ranked Flex");
      break;
    case 450:
      $div.text("ARAM");
      break;
    case 700:
      $div.text("Clash");
      break;
    default:
      $div.text("Unknown");
  }
  return $div;
}

/* 
STATS
*/

function $stats(playerStats, gameLength) {
  console.log("CS per min: " + playerStats.totalMinionsKilled / gameLength);
  $KDA = $("<h4>").text(
    playerStats.kills + " / " + playerStats.deaths + " / " + playerStats.assists
  );

  $CSscore = $("<div>").text(
    "CS: " +
      playerStats.totalMinionsKilled +
      " (" +
      (playerStats.totalMinionsKilled / gameLength).toFixed(1) +
      ")"
  );
  return $('<div class="match-stats-wrapper vertical-middle">')
    .append($KDA)
    .append(
      $('<div class="match-stats">')
        .append($CSscore)
        .append("<div>Vision score: " + playerStats.visionScore + "</div>")
        .append(" <div>Participation: TBD</div>")
    );
}

/* 
PLAYER BUILD
*/

function $playerBuild(items, trinketId, controlWardsCount) {
  $items = $('<div class="items">');

  items.forEach((itemId) => {
    let $item = $('<div class="item">');
    if (itemId != 0) {
      let itemImage = findItemImage(itemId);
      $item.css({
        "background-image":
          "url(" + dDragon.getTinySpriteCdn(itemImage.sprite) + ")",
        "background-position":
          -itemImage.x / 2 + "px " + -itemImage.y / 2 + "px ",
      });
    }
    $items.append($item);
  });

  let $trinket;
  if (trinketId != 0) {
    let trinketImage = findItemImage(trinketId);
    $trinket = $(' <div class="trinket">').css({
      "background-image":
        "url(" + dDragon.getTinySpriteCdn(trinketImage.sprite) + ")",
      "background-position":
        -trinketImage.x / 2 + "px " + -trinketImage.y / 2 + "px ",
    });
  }

  $inventory = $('<div class="inventory">').append($items).append($trinket);

  return $("<div>")
    .addClass("player-build-wrapper")
    .append($inventory)
    .append($('<div class="text">').text("Control wards: " + controlWardsCount))
    .append($('<div class="text">').text("Hourglass: TBD"));
}

function findItemImage(itemId) {
  for (const [itemNum, data] of itemEntries) {
    if (itemNum == itemId) {
      return data.image;
    }
  }
}

/* 
Building picks details
*/
function $pickDetail(match) {
  let playerPId = match.playerPId;
  let playerChampionId = match.participants[playerPId - 1].championId;
  let summ1Id = match.participants[playerPId - 1].spell1Id;
  let summ2Id = match.participants[playerPId - 1].spell2Id;
  let playerChampionData = findChampionData(playerChampionId);
  let summ1Data = findRunesData(summ1Id);
  let summ2Data = findRunesData(summ2Id);

  let playerSprite = dDragon.getSpriteCdn(playerChampionData.image.sprite);

  let champName = playerChampionData.name;
  // let summ1Sprite = dDragon.getSpriteCdn(summ1Data.image.sprite);
  let summ1Sprite = dDragon.getTinySpriteCdn(summ1Data.image.sprite);
  let summ2Sprite = dDragon.getTinySpriteCdn(summ2Data.image.sprite);
  let keystone = "public/resources/Conqueror.png";
  let rune = "public/resources/7203_Whimsy.png";

  // Sprites
  $champIcon = $('<div class="champ-icon">')
    .css("background-image", "url(" + playerSprite + ")")
    .css(
      "background-position",
      -playerChampionData.image.x + "px " + -playerChampionData.image.y + "px"
    )
    .width(playerChampionData.image.w)
    .height(playerChampionData.image.h);

  $summ1 = $("<div>").css({
    "background-image": "url(" + summ1Sprite + ")",
    "background-position":
      -summ1Data.image.x * 0.5 + "px " + -summ1Data.image.y * 0.5 + "px",
    height: "24px",
    width: "24px",
  });
  $summ2 = $("<div>").css({
    "background-image": "url(" + summ2Sprite + ")",
    "background-position":
      -summ2Data.image.x * 0.5 + "px " + -summ2Data.image.y * 0.5 + "px",
    height: "24px",
    width: "24px",
  });

  /* 
  Add Summ Spell
  */
  $summSpell = $("<div>")
    .addClass("summoner-spell")
    .append($summ1)
    .append($summ2);

  /* 
  Get runes info
  */
  let keystoneId = match.participants[playerPId - 1].stats.perk0;
  let perkPrimaryStyle =
    match.participants[playerPId - 1].stats.perkPrimaryStyle;
  $keystone = $('<div class="keystone">').css(
    "background-image",
    "url(" +
      dDragon.keystoneIconCdn(findKeystoneIcon(keystoneId, perkPrimaryStyle)) +
      ")"
  );

  let secondaryTreeIconId =
    match.participants[playerPId - 1].stats.perkSubStyle;

  let $secondaryTree = $("<div >").css(
    "background-image",
    "url(" + dDragon.keystoneIconCdn(findTreeIcon(secondaryTreeIconId)) + ")"
  );

  $runes = $("<div>")
    .addClass("runes")
    .append($keystone)
    .append($secondaryTree);

  $details = $("<div>")
    .addClass("pick-detail")
    .append($champIcon, $summSpell, $runes);

  $champName = $("<div>").addClass("name").text(champName);

  return $("<div>")
    .addClass("pick-detail-wrapper")
    .append($details)
    .append($champName);
}

function findKeystoneIcon(keystoneId, keystoneTreeId) {
  let runeTree = findTree(keystoneTreeId);

  let keystonIcon;
  runeTree.slots[0].runes.forEach((keystone) => {
    if (keystone.id == keystoneId) {
      keystonIcon = keystone.icon;
      return;
    }
  });
  return keystonIcon;
}

function findTreeIcon(treeId) {
  return findTree(treeId).icon;
}

function findTree(treeId) {
  let runeTree;
  switch (treeId) {
    case 8100:
      runeTree = dominationTree;
      break;
    case 8000:
      runeTree = precisionTree;
      break;
    case 8300:
      runeTree = inspirationTree;
      break;
    case 8400:
      runeTree = resolveTree;
      break;
    case 8200:
      runeTree = sorceryTree;
      break;
    default:
      console.log("Default");
      return;
  }
  return runeTree;
}

function findChampionData(champId) {
  for (const [champion, data] of championEntries) {
    if (data.key == champId) {
      return data;
    }
  }
}

function findRunesData(summId) {
  for (const [summ, data] of summEntries) {
    if (data.key == summId) {
      return data;
    }
  }
}
