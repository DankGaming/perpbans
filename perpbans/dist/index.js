if( getSteamAPIKey() == null){
  $('#allowsearch').hide();
  $('#apikey').show();
}
else{
  $('#allowsearch').show();
  $('#apikey').hide();
  
}
var key = "";
var steamApi = "";
(async () => {
  key = await getSteamAPIKey();
  steamApi = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=" + key;
})()

const scambans = "https://bans.perpheads.com/player"

const errors = document.querySelector(".errors");
const test = document.querySelector(".playerdata");
const loading = document.querySelector(".loading");
const results = document.querySelector(".result-container");

results.style.display = "none";
loading.style.display = "none";
errors.textContent = "";

const form = document.querySelector(".form-data");
const steamid = document.querySelector(".steamid");
const apikey = document.querySelector(".apikey");

const searchSteamID = async steamId => {
  loading.style.display = "block";
  errors.textContent = "";
  try {
    const steamresponse = await axios.get(`${steamApi}&steamid=${steamId}&relationship=friend`);
    const userRaw = await axios.get(`${scambans}/${steamId}`)
    const user = userRaw.data;

    handleRetrieval(steamId).then((el) => {
      getGamePlaytime(steamId).then((gametime) => {
        axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&format=json&steamids=${steamId}`).then((user) => {
          userData = user.data.response.players[0];
          if(el != null && !el.innerHTML.includes("Unbanned") &&   !el.innerHTML.includes("Expired")){
            $('#playerresult > tbody:last-child').append("<tr><td>" + userData.personaname + "</td><td><a href=https://steamcommunity.com/profiles/" + userData.steamid + " target='_blank' >" + userData.steamid + "</a></td>" + "<td><a href=https://bans.perpheads.com/player/" + userData.steamid + " target='_blank' >" + el.innerHTML + "</a></td><td>" + gametime + "</td><td>" + unixToDate(userData.timecreated)+ "</td></tr>");
          }
          else{
            $('#playerresult > tbody:last-child').append("<tr><td>" + userData.personaname + "</td><td><a href=https://steamcommunity.com/profiles/" + userData.steamid + " target='_blank' >" + userData.steamid + "</a></td>" + "<td>No bans on record</td><td>" + gametime + "</td><td>" + unixToDate(userData.timecreated)+ "</td></tr>");
          }
        }).catch()
      }).catch()
    }).catch()

    var el = document.createElement( 'html' );
    el.innerHTML = user;

    temp = el.getElementsByClassName("duration")[0]

    var friendlist = steamresponse.data;
    var listOfFriends = friendlist["friendslist"]["friends"];

    listOfFriends.forEach(function(data){  
      handleRetrieval(data["steamid"]).then((el) => {
        handleGetSteam(data["steamid"]).then((name) => {
          getGamePlaytime(data["steamid"]).then((gametime) => {
            if(el != null && !el.innerHTML.includes("Unbanned") &&   !el.innerHTML.includes("Expired")){
              $('#results > tbody:last-child').append("<tr><td>" + name + "</td><td><a href=https://steamcommunity.com/profiles/" + data["steamid"] + " target='_blank' >" + data["steamid"] + "</a></td>" + "<td><a href=https://bans.perpheads.com/player/" + data["steamid"] + " target='_blank' >" + el.innerHTML + "</a></td><td>" + gametime + "</td></tr>");
            }
            else if(gametime > 0 && gametime < 50){
              $('#results > tbody:last-child').append("<tr><td>" + name + "</td><td><a href=https://steamcommunity.com/profiles/" + data["steamid"] + " target='_blank' >" + data["steamid"] + "</a><td>No bans on record</td></td><td>" + gametime + "</td></tr>");
            }
        });
        }).catch()
      }).catch();
    })

    loading.style.display = "none";
    results.style.display = "block";
  } catch (error) {
    loading.style.display = "none";
    results.style.display = "none";
    errors.innerHTML = "<b>Error! Possible causes:</b><ul><li>This is not a valid steam64 ID</li><li>User has a private profile</li><li>User has no banned friends</li></ul>";
  }
};

const unixToDate = unixStamp => {
  var utcSeconds = unixStamp;
  var d = new Date(0);
  d.setUTCSeconds(utcSeconds);
  return d;
}

const handleRetrieval = async steamID => {
  const userRaw = await axios.get(`${scambans}/${steamID}`)
  const user = userRaw.data;

  var el = document.createElement( 'html' );
  el.innerHTML = user;

  return el.getElementsByClassName("duration")[0]
};

const handleGetSteam = async steamID => {
  const userRaw = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&format=json&steamids=${steamID}`)
  var table = userRaw.data;
  var username = table["response"]["players"][0]["personaname"];

  return username;
};


const getGamePlaytime = async steamID => {
  const userRaw = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamID}&7format=json`)
  var playtime = 0;
  if(userRaw.data.response.games){
    userRaw.data.response.games.forEach(element => {
      if(element.appid === 4000){
        playtime = parseInt(element.playtime_forever / 60);
      }
    });
    return playtime
  }
  else{
    return 0
  }
}

$('#apikey').on("submit", function(e) {
  e.preventDefault(); // cancel the actual submit
  saveSteamAPIKey()
});

$('#allowsearch').on("submit", function(e) {
  e.preventDefault(); // cancel the actual submit
  searchSteamID(steamid.value);
});

function saveSteamAPIKey() {
  var apiKey = apikey.value;
  if (!apiKey) {
    message('Error: No value specified');
    return;
  }
  chrome.storage.sync.set({'steamAPIKey': apiKey}, function() {
    message('API Key has been stored')
  });
}

async function getSteamAPIKey() {
  return new Promise((resolve, reject) => {
      chrome.storage.sync.get('steamAPIKey', resolve);
  }).then(result => {
    if ("steamAPIKey" == null) return result;
    else return result["steamAPIKey"];
  });
}