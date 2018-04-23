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

exports.getStarship = async function(req, res) {
    const starship = await helpers.getItem(swapiUrl, req.params.starship_id);
    if (starship) {
        res.json(starship);
    } else {
        res.status(404).send('No starship found.');
    }
}

exports.getPilots = async function(req, res) {
    const starship = await helpers.getItem(swapiUrl, req.params.starship_id);
    if (starship) {
        let pilots = [];
        for (let personUrl of starship.pilots) {
            const pieces = personUrl.split('/');
            const id = pieces[pieces.length - 2];
            const person = await helpers.getItem('https://swapi.co/api/people', id);
            pilots.push(person);
        }
        if (pilots.length != 0) {
            res.json(new CollectionResponse(pilots));
        }
        else {
            res.status(404).send('No people found.');
        }
    } else {
        res.status(404).send('No starship found.');
    }
}

exports.getFilteredStarships = async function(req, res) {
    let starships = await helpers.getCollection(swapiUrl);
    starships = helpers.filterCollection(starships, req.query);
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('No starships found.');
    }
};