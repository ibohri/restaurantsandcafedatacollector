const googleMapsClient = require("@google/maps").createClient({
  //TODO: change api key from here and make it more secure
  key: "AIzaSyDrFB6rHVJ5-3yJmXPThZWUIqjBzLi9wnI",
  Promise: Promise
});

module.exports = googleMapsClient;
