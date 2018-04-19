'use strict';

const CollectionResponse = require('./models/CollectionResponse');
const helpers = require('./helpers/RequestHelpers.js');

exports.getAllSpecies = async function(req, res) {
    const species = await helpers.getCollection('https://swapi.co/api/species/?page=1');
    if (species.length != 0) {
        res.json(new CollectionResponse(species));
    } else {
        res.status(404).send('Error');
    }
};


exports.getFilteredSpecies = async function(req, res) {
    let species = await helpers.getCollection('https://swapi.co/api/species/?page=1');
    species = helpers.filterCollection(species, req.query);
    if (species.length != 0) {
        res.json(new CollectionResponse(species));
    } else {
        res.status(404).send('No species found.');
    }
};