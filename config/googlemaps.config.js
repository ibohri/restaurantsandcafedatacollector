const googleMapsClient = require("@google/maps").createClient({
  key: process.env.API_KEY,
  Promise: Promise
});

module.exports = googleMapsClient;
