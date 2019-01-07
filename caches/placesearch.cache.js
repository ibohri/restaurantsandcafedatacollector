const uuidv1 = require("uuid/v1");
let placeSearchCache = {};

function addToCache(obj) {
    const id = uuidv1();
    placeSearchCache[id] = obj;
    setTimeout(() => removeFromCache(id), 2 * 1000 * 60);
    return id;
}

function removeFromCache(id) {
    if (Object.keys.filter(id).length > 0) {
        delete placeSearchCache[id];
    }
}

function getFromCache(id) {
    return placeSearchCache[id];
}

module.exports = {
    addToCache, removeFromCache, getFromCache
}