function createMatch() {
  $heanding = $('<div class="match-header">')
    .append("<div>3 days ago</div>")
    .append("<div>40 mins</div>")
    .append("<div>Avg rating: Plat 4</div>");

  // Creating body
  $body = $('<div class="match-body rounded-bottom p-1">')
    .append($matchResult())
    .append($pickDetail())
    .append($stats())
    .append($playerBuild())
    .append($teams());

  return $('<div class="match-wrapper">').append($heanding).append($body);
}

function $teams() {
  $teamBlue = $('<div class"team-blue>');
  for (i = 0; i < 5; i++) {
    $teamBlue.append($teamMember());
  }

  $teamRed = $('<div class"team-red>');
  for (i = 0; i < 5; i++) {
    $teamRed.append($teamMember());
  }

  return $('<div class="teams-wrapper">').append($teamBlue).append($teamRed);
}

function $teamMember() {
  return $('<div class="team-member">')
    .append('<img src="public/resources/Irelia.png" />')
    .append("<div>MakingHandties</div>");
}

function $matchResult() {
  return $("<div>")
    .addClass("match-result")
    .append('<div class="win-text">Victory</div>')
    .append('<hr class="my-1" />')
    .append('<div class="type-text">Ranked</div>')
    .append('<div class="type-text">Solo Duo</div>');
}

function $stats() {
  return $("<div>")
    .addClass("match-stats-wrapper vertical-middle")
    .append("<h4>0 / 0 / 0</h4>")
    .append(
      $('<div class="match-stats">')
        .append("<div>CS: 231 (6.4)</div>")
        .append("<div>Dmg Share: 41%</div>")
        .append(" <div>Participation: 41%</div>")
    );
}

function $playerBuild() {
  $items = $('<div class="items">');
  for (i = 0; i < 6; i++) {
    $items.append('<img src="public/resources/Conqueror.png" />');
  }
  $inventory = $('<div class="inventory">')
    .append($items)
    .append(
      $(' <div class="trinket">').append(
        '<img src="public/resources/7203_Whimsy.png"/>'
      )
    );

  return $("<div>")
    .addClass("player-build-wrapper")
    .append($inventory)
    .append($("<div>").text("Control wards: 5"))
    .append($("<div>").text("Hourglass: Yes"));
}

function $pickDetail() {
  champIcon =
    "http://ddragon.leagueoflegends.com/cdn/10.16.1/img/champion/Irelia.png";
  summ1 = "public/resources/flash.jpg";
  summ2 = "public/resources/ignite.jpg";
  keystone = "public/resources/Conqueror.png";
  rune = "public/resources/7203_Whimsy.png";
  champName = "Irelia";

  $champIcon = $("<img>").addClass("champ-icon").attr("src", champIcon);
  $summSpell = $("<div>")
    .addClass("summoner-spell")
    .append($("<img>").attr("src", summ1))
    .append($("<img>").attr("src", summ2));

  $runes = $("<div>")
    .addClass("runes")
    .append($("<img>").attr("src", keystone))
    .append($("<img>").attr("src", rune));

  $details = $("<div>")
    .addClass("pick-detail")
    .append($champIcon, $summSpell, $runes);

  $champName = $("<div>").addClass("name").text(champName);

  return $("<div>")
    .addClass("pick-detail-wrapper")
    .append($details)
    .append($champName);
}
