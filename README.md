# perpbans
This allows you to get all a users friends and check if they are currently banned

## How to prepare
1. Generate a steam API Key at https://steamcommunity.com/dev/apikey
2. Download the repository as zip and extract it into the desired folder
3. Open the folder, Then open dist. Open the index.js file
4. On line 1 add your steam api key so it looks like this: const steamApi = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=XXXXXXXXXXXXXXXXXXXXXXX"

## Loading in chrome
1. Open google chrome
2. Go to chrome://extensions/
3. Click load unpacked
4. Select the perpbans folder

## Loading in firefox
1. Open firefox
2. follow this guide: https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/

The plugin should now be loaded. Clicking the jigsaw piece should allow you to pin it to your bar.

## How to use
1. Find the steam64id of the person you want to check
2. Insert his ID into the search bar
3. You will now get the persons last ban and all his/her currently banned friends
