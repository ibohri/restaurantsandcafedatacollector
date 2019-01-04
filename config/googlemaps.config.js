const googleMapsClient = require("@google/maps").createClient({
  //TODO: change api key from here and make it more secure
  key: process.env.API_KEY,
  Promise: Promise
});

module.exports = googleMapsClient;
