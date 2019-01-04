const googleMapsClient = require("../config/googlemaps.config");

module.exports.getLocations = async zipCode => {
    try {
        if (!zipCode) {
            console.log("zip code is required");
            return [];
        }
        const response = await googleMapsClient
            .places({ query: `${zipCode}`, type: "cafe" })
            .asPromise();
        return response.json.results;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
 