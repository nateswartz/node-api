'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');

const _collectionName = 'species';

exports.getAllSpecies = async function(req, res) {
    const species = await helpers.getCollection(_collectionName);
    if (species.length != 0) {
        res.json(new CollectionResponse(species));
    } else {
        res.status(404).send('No species found.');
    }
};

exports.getSpecies = async function(req, res) {
    const species = await helpers.getItem(_collectionName, req.params.species_id);
    if (species) {
        res.json(species);
    } else {
        res.status(404).send('No species found.');
    }
}

exports.getAllSpeciesInfo = async function(req, res) {
    const species = await helpers.getItem(_collectionName, req.params.species_id);

    for (let property in species) {
        if (Array.isArray(species[property]) || (species[property].startsWith('http') && property !== 'url')) {
            const collection = await helpers.getCollectionForItemProperty(species, property);
            species[property] = collection;
        }
    }

    if (species) {
        res.json(species);
    } else {
        res.status(404).send('No species found.');
    }
}

exports.getFilteredSpecies = async function(req, res) {
    let species = await helpers.getCollection(_collectionName);
    species = helpers.filterCollection(species, req.query);
    if (species.length != 0) {
        res.json(new CollectionResponse(species));
    } else {
        res.status(404).send('No species found.');
    }
};