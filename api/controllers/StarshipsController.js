'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');

const _collectionName = 'starships';

exports.getAllStarships = async function(req, res) {
    const starships = await helpers.getCollection(_collectionName);
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('No starships found.');
    }
};

exports.getStarship = async function(req, res) {
    const starship = await helpers.getItem(_collectionName, req.params.starship_id);
    if (starship) {
        res.json(starship);
    } else {
        res.status(404).send('No starship found.');
    }
}

exports.getAllStarshipInfo = async function(req, res) {
    const starship = await helpers.getItem(_collectionName, req.params.starship_id);

    for (let property in starship) {
        if (Array.isArray(starship[property]) || (starship[property].startsWith('http') && property !== 'url')) {
            const collection = await helpers.getCollectionForItemProperty(starship, property);
            starship[property] = collection;
        }
    }

    if (starship) {
        res.json(starship);
    } else {
        res.status(404).send('No starship found.');
    }
}

exports.getFilteredStarships = async function(req, res) {
    let starships = await helpers.getCollection(_collectionName);
    starships = helpers.filterCollection(starships, req.query);
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('No starships found.');
    }
};