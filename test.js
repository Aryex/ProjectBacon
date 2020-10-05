const championsJSON = require("./public/data/champion.json");
const config = require("./config");
const riot = require("./RiotApi");
var fs = require("fs");

// console.log(championsData);
riot.start(config.ApiKey);
riot
  .request(option("/lol/match/v4/timelines/by-match/3573053686"))
  .then((res) => {
    let data = [];
    i = 0;
    res.data.frames.forEach((frame) => {
      for (let key in frame.participantFrames) {
        if (frame.participantFrames[key].participantId == 7) {
          if (frame.participantFrames[key].position) {
            data.push(
              "\n" +
                frame.participantFrames[key].position.x +
                " " +
                frame.participantFrames[key].position.y
            );
          }
        }
      }
    });
    console.log(data);
    fs.writeFile("data.txt", data, (err) => {
      err ? console.log("PACK WRITE ERROR: " + err) : null;
    });
  });

return;
