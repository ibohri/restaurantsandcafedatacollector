const googleMapsClient = require("@google/maps").createClient({
  //TODO: change api key from here and make it more secure
  key: "AIzaSyDf335pCOu4nMhDgfqYGrBUxPW9KYQpPF0",
  Promise: Promise
});

module.exports = googleMapsClient;
