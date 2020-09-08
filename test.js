const championsJSON = require("./public/data/champion.json");
const riot = require("./RiotApi");

let champId = 39;
// console.log(championsData);
fetch();
entries = Object.entries(championsJSON.data);
console.log(entries);
for (const [champion, data] of entries) {
  if (data.key == champId) {
    console.log(champion);
  }
}
return;
