const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client =
  new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );


function getAuthUrl() {
  // generate a url that asks permissions for sheets scopes
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

  var url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES // If you only need one scope you can pass it as string
  });

  return url;
}

async function setCredentials(code, callback) {
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error while trying to retrieve access token', err);
    oauth2Client.setCredentials(token);
    callback();
  });
}

function getAuthClient() {
  return oauth2Client;
}

module.exports = {
  getAuthUrl: getAuthUrl,
  setCredentials: setCredentials,
  getAuthClient: getAuthClient
}
