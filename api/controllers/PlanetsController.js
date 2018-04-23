'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');
const swapiUrl = 'https://swapi.co/api/planets';

exports.getAllPlanets = async function(req, res) {
    const planets = await helpers.getCollection(swapiUrl);
    if (planets.length != 0) {
        res.json(new CollectionResponse(planets));
    } else {
        res.status(404).send('No planets found.');
    }
};

exports.getPlanet = async function(req, res) {
    const planet = await helpers.getItem(swapiUrl, req.params.planet_id);
    if (planet) {
        res.json(planet);
    } else {
        res.status(404).send('No planet found.');
    }
}

exports.getResidents = async function(req, res) {
    const residents = await helpers.getCollectionForItemProperty(swapiUrl, req.params.planet_id, 'residents', 'https://swapi.co/api/people');
    if (residents.length != 0) {
        res.json(new CollectionResponse(residents));
    } else {
        res.status(404).send('No residents found.');
    }
}

exports.getFilteredPlanets = async function(req, res) {
    let planets = await helpers.getCollection(swapiUrl);
    planets = helpers.filterCollection(planets, req.query);
    if (planets.length != 0) {
        res.json(new CollectionResponse(planets));
    } else {
        res.status(404).send('No planets found.');
    }
};

exports.getRandomPlanet = async function(req, res) {
    let planets = await helpers.getCollection(swapiUrl);
    if (planets.length !=0) {
        const randomPerson = planets[Math.floor(Math.random() * planets.length)];
        res.json(new CollectionResponse(randomPerson));
    } else {
        res.status(404).send('No planet found.');
    }
}