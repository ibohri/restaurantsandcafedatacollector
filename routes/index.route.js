const express = require("express");
const router = express.Router();
const uuidv1 = require('uuid/v1');
const locationController = require("../controller/location.controller");
const sheetsController = require("../controller/sheets.controller");
const multer = require("../config/multer.config");
const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);
const querystring = require("querystring");

router.post("/api/addLocationData", multer.upload, async (req, res, next) => {
    try {
        const file = await readFileAsync(req.file.path, "utf8");

        const zipCodes = (file || "").split(/\n|\r|,/g).filter(code => !!code);
        if (zipCodes.length > 0) {
            const zipCollectionInfo = [];
            const allLocationsData = await Promise.all(zipCodes.map(async zipCode => {
                try {
                    const locations = await locationController.getLocations(zipCode);
                    zipCollectionInfo.push({
                        zip_code: zipCode,
                        collection_date: (new Date()).toLocaleDateString(),
                        status: "Complete"
                    });
                    return {
                        post_code: zipCode,
                        locations: locations
                    };
                }
                catch (e) {
                    console.log(e);
                    zipCollectionInfo.push({
                        zip_code: zipCode,
                        collection_date: (new Date()).toLocaleDateString(),
                        status: "Not Complete"
                    });
                    const query = querystring.stringify({
                        "uploaded": false,
                        "error": e
                    });
                    res.redirect("/uploadstatus/?" + query);
                }
            }));

            let formattedLocations = [];
            allLocationsData.forEach(locData => {
                locData.locations.forEach(location => {
                    location = getFormattedLocation(location);
                    location = {
                        ...{
                            row_key: uuidv1(),
                            collection_date: (new Date()).toLocaleDateString(),
                            post_code: locData.post_code
                        }, ...location
                    };
                    formattedLocations.push(Object.keys(location).map(key => location[key]));
                });
            });
            await sheetsController.addLocationsData(formattedLocations);
            await sheetsController.addPostCodeCollectionData(zipCollectionInfo.map(info => Object.keys(info).map(key => info[key])));
            console.log("Deleting file - " + req.file.path);
            await unlinkAsync(req.file.path);
        }
        const query = querystring.stringify({
            "uploaded": true
        });
        res.redirect("/uploadstatus/?" + query);
    }
    catch (e) {
        console.log("Deleting file - " + req.file.path);
        await unlinkAsync(req.file.path);
        console.log(e);
        const query = querystring.stringify({
            "uploaded": false,
            "error": e
        });
        res.redirect("/uploadstatus/?" + query);
    }
});

router.get("/uploadstatus", (req, res) => {
    res.render("uploadstatus", { uploaded: req.query.uploaded, message: req.query.error });
});


function getFormattedLocation(location) {
    if (location) {
        return {
            address: location.formatted_address,
            name: location.name,
            rating: location.rating,
            price_level: location.price_level
        };
    }
    return {};
};

module.exports = router;
