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

exports.getPerson = async function(req, res) {
    const person = await helpers.getItem(swapiUrl, req.params.person_id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).send('No person found.');
    }
}

exports.getAllPersonInfo = async function(req, res) {
    const person = await helpers.getItem(swapiUrl, req.params.person_id);

    for (let property in person) {
        if (Array.isArray(person[property]) || (person[property].startsWith('http') && property !== 'url')) {
            const collection = await helpers.getCollectionForItemProperty(swapiUrl, req.params.person_id, property, 'https://swapi.co/api/' + property);
            person[property] = collection;
        }
    }

    //const species = await helpers.getCollectionForItemProperty(swapiUrl, req.params.person_id, 'species', 'https://swapi.co/api/species');
    //const vehicles = await helpers.getCollectionForItemProperty(swapiUrl, req.params.person_id, 'vehicles', 'https://swapi.co/api/vehicles')
    //const starships = await helpers.getCollectionForItemProperty(swapiUrl, req.params.person_id, 'starships', 'https://swapi.co/api/starships')
    //const planet = await helpers.getCollectionForItemProperty(swapiUrl, req.params.person_id, 'homeworld', 'https://swapi.co/api/planets')

    //person.species = species;
    //person.vehicles = vehicles;
    //person.starships = starships;
    //person.homeworld = planet;

    if (person) {
        res.json(person);
    } else {
        res.status(404).send('No person found.');
    }
}

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