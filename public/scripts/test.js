const championsData = require("../data/champion.json");

let champId = 39;
console.log(championsData);
return;
fs.readFile("./public/data/champion.json", (err, data) => {
  if (err) console.log(err);
  entries = Object.entries(JSON.parse(data).data);
  for (const [champion, data] of entries) {
    if (data.key == champId) {
      console.log(champion);
    }
  }
});
