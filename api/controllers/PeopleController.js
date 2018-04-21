'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');

exports.getAllPeople = async function(req, res) {
    const people = await helpers.getCollection('https://swapi.co/api/people/?page=1');
    if (people.length != 0) {
        res.json(new CollectionResponse(people));
    } else {
        res.status(404).send('Error');
    }
};


exports.getFilteredPeople = async function(req, res) {
    let people = await helpers.getCollection('https://swapi.co/api/people/?page=1');
    people = helpers.filterCollection(people, req.query);
    if (people.length != 0) {
        res.json(new CollectionResponse(people));
    } else {
        res.status(404).send('No people found.');
    }
};

exports.getRandomPerson = async function(req, res) {
    let people = await helpers.getCollection('https://swapi.co/api/people/?page=1');
    if (people.length !=0) {
        const randomPerson = people[Math.floor(Math.random() * people.length)];
        res.json(new CollectionResponse(randomPerson));
    } else {
        res.status(404).send('No people found.');
    }
}