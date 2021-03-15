if( getSteamAPIKey() == null){
  $('#allowsearch').hide();
  $('#apikey').show();
}
else{
  $('#allowsearch').show();
  $('#apikey').hide();
  
}

var steamApi = "";
(async () => {
  const key = await getSteamAPIKey();
  steamApi = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=" + key;
})()

const scambans = "https://bans.perpheads.com/player"

const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const results = document.querySelector(".result-container");

results.style.display = "none";
loading.style.display = "none";
errors.textContent = "";

const form = document.querySelector(".form-data");
const steamid = document.querySelector(".steamid");
const apikey = document.querySelector(".apikey");

// declare a method to search by country name
const searchSteamID = async steamId => {
  loading.style.display = "block";
  errors.textContent = "";
  try {
    const steamresponse = await axios.get(`${steamApi}&steamid=${steamId}&relationship=friend`);
    const userRaw = await axios.get(`${scambans}/${steamId}`)
    const user = userRaw.data;

    var el = document.createElement( 'html' );
    el.innerHTML = user;

    temp = el.getElementsByClassName("duration")[0]
    alert("This user is banned for " + temp.innerHTML);

    var friendlist = steamresponse.data;
    var listOfFriends = friendlist["friendslist"]["friends"];

    listOfFriends.forEach(function(data){  
      handleRetrieval(data["steamid"]).then((el) => {
        if(el != null && !el.innerHTML.includes("Unbanned") &&   !el.innerHTML.includes("Expired")){
          $('#results > tbody:last-child').append("<tr><td><a href=https://steamcommunity.com/profiles/" + data["steamid"] + " target='_blank' >" + data["steamid"] + "</a></td>" + "<td><a href=https://bans.perpheads.com/player/" + data["steamid"] + " target='_blank' >" + el.innerHTML + "</a></td>" + "</tr>");
        }
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

const handleRetrieval = async steamID => {
  const userRaw = await axios.get(`${scambans}/${steamID}`)
  const user = userRaw.data;

  var el = document.createElement( 'html' );
  el.innerHTML = user;

  return el.getElementsByClassName("duration")[0]
};

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