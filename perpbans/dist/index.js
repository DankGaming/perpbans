const steamApi = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key="
const scambans = "https://bans.perpheads.com/player"

const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const results = document.querySelector(".result-container");

results.style.display = "none";
loading.style.display = "none";
errors.textContent = "";

const form = document.querySelector(".form-data");
const steamid = document.querySelector(".steamid");

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
    errors.textContent = "This is not a valid steam64 ID";
  }
};

const handleRetrieval = async steamID => {
  const userRaw = await axios.get(`${scambans}/${steamID}`)
  const user = userRaw.data;

  var el = document.createElement( 'html' );
  el.innerHTML = user;

  return el.getElementsByClassName("duration")[0]
};
// declare a function to handle form submission
const handleSubmit = async e => {
  e.preventDefault();
  searchSteamID(steamid.value);
};

form.addEventListener("submit", e => handleSubmit(e));