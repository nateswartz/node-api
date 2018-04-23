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

exports.getSpecies = async function(req, res) {
    const species = await helpers.getItem(swapiUrl, req.params.species_id);
    if (species) {
        res.json(species);
    } else {
        res.status(404).send('No species found.');
    }
}

exports.getPeople = async function(req, res) {
    const species = await helpers.getItem(swapiUrl, req.params.species_id);
    if (species) {
        let membersOfSpecies = [];
        for (let personUrl of species.people) {
            const pieces = personUrl.split('/');
            const id = pieces[pieces.length - 2];
            const person = await helpers.getItem('https://swapi.co/api/people', id);
            membersOfSpecies.push(person);
        }
        if (membersOfSpecies.length != 0) {
            res.json(new CollectionResponse(membersOfSpecies));
        }
        else {
            res.status(404).send('No people found.');
        }
    } else {
        res.status(404).send('No species found.');
    }
}

exports.getFilteredSpecies = async function(req, res) {
    let species = await helpers.getCollection(swapiUrl);
    species = helpers.filterCollection(species, req.query);
    if (species.length != 0) {
        res.json(new CollectionResponse(species));
    } else {
        res.status(404).send('No species found.');
    }
};