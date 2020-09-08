/* 
Singleton
*/

var DDragon = ((patch) => {
  var instance;

  function createInstance(patch) {
    var object = new DDragonObj(patch);
    return object;
  }

  return {
    getInstance: (patch) => {
      if (!instance) {
        instance = createInstance(patch);
      }
      return instance;
    },
  };
})();

function DDragonObj(patch) {
  this.url = "http://ddragon.leagueoflegends.com/cdn/" + patch;
  this.urlNoPatch = "http://ddragon.leagueoflegends.com/cdn";

  this.keystoneIconCdn = (path) => {
    return this.urlNoPatch + "/img/" + path;
  };
  this.iconCdn = (iconNum) => {
    return this.url + "/img/profileicon/" + iconNum + ".png";
  };
  this.championDataCdn = () => {
    return this.url + "/data/en_US/champion.json";
  };
  this.summDataCdn = () => {
    return this.url + "/data/en_US/summoner.json";
  };
  this.runesDataCdn = () => {
    return this.url + "/data/en_US/runesReforged.json";
  };
  this.itemsDataCdn = () => {
    return this.url + "/data/en_US/item.json";
  };
  this.getSpriteCdn = (spriteName) => {
    return this.url + "/img/sprite/" + spriteName;
  };
  this.getTinySpriteCdn = (spriteName) => {
    return this.url + "/img/sprite/" + "tiny_" + spriteName;
  };
}
