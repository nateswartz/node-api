'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');
const swapiUrl = 'https://swapi.co/api/starships';

exports.getAllStarships = async function(req, res) {
    const starships = await helpers.getCollection(swapiUrl);
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('No starships found.');
    }
};

exports.getFilteredStarships = async function(req, res) {
    let starships = await helpers.getCollection(swapiUrl);
    starships = helpers.filterCollection(starships, req.query);
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('No starships found.');
    }
};