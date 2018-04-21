'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');
const swapiUrl = 'https://swapi.co/api/species';

exports.getAllSpecies = async function(req, res) {
    const species = await helpers.getCollection(swapiUrl);
    if (species.length != 0) {
        res.json(new CollectionResponse(species));
    } else {
        res.status(404).send('No species found.');
    }
};


exports.getFilteredSpecies = async function(req, res) {
    let species = await helpers.getCollection(swapiUrl);
    species = helpers.filterCollection(species, req.query);
    if (species.length != 0) {
        res.json(new CollectionResponse(species));
    } else {
        res.status(404).send('No species found.');
    }
};