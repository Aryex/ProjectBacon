const axios = require("axios").default;
const schedule = require("./Schedule");
/* *
*
Riot Api make request to Riot endpoints.
    It uses a scheduler to controll request rate. 
*
* */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class RiotApi {
  constructor(ApiKey) {
    this.ApiKey = ApiKey;
    this.ratePerSec;
    this.ratePerMin;
  }

  async getPlayerAccByName(playerName) {
    try {
      console.log("returning");
      return (
        await axios(
          new Option(this.ApiKey).getPlayerAccByName(playerName).build()
        )
      ).data;
    } catch (res) {
      console.log("catch res");
      return res.response.data;
    }
  }
}

class Option {
  constructor(apiKey) {
    this.option = {
      method: "get",
      baseURL: "https://na1.api.riotgames.com",
      url: "",
      headers: { "X-Riot-Token": `${apiKey}` },
    };
  }
  getPlayerAccByName(summonerName) {
    this.option.url = `/lol/summoner/v4/summoners/by-name/${summonerName}`;
    return this;
  }
  build() {
    return this.option;
  }
}

module.exports = RiotApi;
