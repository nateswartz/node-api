'use strict';

const CollectionResponse = require('./models/CollectionResponse');
const helpers = require('./helpers/RequestHelpers');

exports.getAllStarships = async function(req, res) {
    const starships = await helpers.getCollection('https://swapi.co/api/starships/?page=1');
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('Error');
    }
};