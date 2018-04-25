'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');

const collectionName = 'starships';

exports.getAllStarships = async function(req, res) {
    const starships = await helpers.getCollection(collectionName);
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('No starships found.');
    }
};

exports.getStarship = async function(req, res) {
    const starship = await helpers.getItem(collectionName, req.params.starship_id);
    if (starship) {
        res.json(starship);
    } else {
        res.status(404).send('No starship found.');
    }
}

exports.getPilots = async function(req, res) {
    const pilots = await helpers.getCollectionForItemProperty(collectionName, req.params.starship_id, 'pilots', 'people');
    if (pilots.length != 0) {
        res.json(new CollectionResponse(pilots));
    } else {
        res.status(404).send('No pilots found.');
    }
}

exports.getFilteredStarships = async function(req, res) {
    let starships = await helpers.getCollection(collectionName);
    starships = helpers.filterCollection(starships, req.query);
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('No starships found.');
    }
};