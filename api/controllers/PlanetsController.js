'use strict';

const axios = require('axios');

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');
const swapiUrl = 'https://swapi.co/api/planets/?page=1';

exports.getAllPlanets = async function(req, res) {
    const planets = await helpers.getCollection(swapiUrl);
    if (planets.length != 0) {
        res.json(new CollectionResponse(planets));
    } else {
        res.status(404).send('Error');
    }
};

exports.getPlanet = async function(req, res) {
    try {
        const response = await axios.get('https://swapi.co/api/planets/' + req.params.planet_id);
        res.json(new CollectionResponse(response.data));
    } catch (error) {
        res.status(404).send('No planet found');
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
        res.status(404).send('No planets found.');
    }
}