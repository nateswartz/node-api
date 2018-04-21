'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');
const swapiUrl = 'https://swapi.co/api/people';

exports.getAllPeople = async function(req, res) {
    const people = await helpers.getCollection(swapiUrl);
    if (people.length != 0) {
        res.json(new CollectionResponse(people));
    } else {
        res.status(404).send('No people found.');
    }
};


exports.getFilteredPeople = async function(req, res) {
    let people = await helpers.getCollection(swapiUrl);
    people = helpers.filterCollection(people, req.query);
    if (people.length != 0) {
        res.json(new CollectionResponse(people));
    } else {
        res.status(404).send('No people found.');
    }
};

exports.getRandomPerson = async function(req, res) {
    let people = await helpers.getCollection(swapiUrl);
    if (people.length !=0) {
        const randomPerson = people[Math.floor(Math.random() * people.length)];
        res.json(new CollectionResponse(randomPerson));
    } else {
        res.status(404).send('No people found.');
    }
}