'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');

const collectionName = 'species';

exports.getAllSpecies = async function(req, res) {
    const species = await helpers.getCollection(collectionName);
    if (species.length != 0) {
        res.json(new CollectionResponse(species));
    } else {
        res.status(404).send('No species found.');
    }
};

exports.getSpecies = async function(req, res) {
    const species = await helpers.getItem(collectionName, req.params.species_id);
    if (species) {
        res.json(species);
    } else {
        res.status(404).send('No species found.');
    }
}

exports.getPeople = async function(req, res) {
    const membersOfSpecies = await helpers.getCollectionForItemProperty(collectionName, req.params.species_id, 'people', 'people');
    if (membersOfSpecies.length != 0) {
        res.json(new CollectionResponse(membersOfSpecies));
    } else {
        res.status(404).send('No people found.');
    }
}

exports.getFilteredSpecies = async function(req, res) {
    let species = await helpers.getCollection(collectionName);
    species = helpers.filterCollection(species, req.query);
    if (species.length != 0) {
        res.json(new CollectionResponse(species));
    } else {
        res.status(404).send('No species found.');
    }
};