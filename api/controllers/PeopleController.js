'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');

const collectionName = 'people';

exports.getAllPeople = async function(req, res) {
    const people = await helpers.getCollection(collectionName);
    if (people.length != 0) {
        res.json(new CollectionResponse(people));
    } else {
        res.status(404).send('No people found.');
    }
};

exports.getPerson = async function(req, res) {
    const person = await helpers.getItem(collectionName, req.params.person_id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).send('No person found.');
    }
}

exports.getAllPersonInfo = async function(req, res) {
    const person = await helpers.getItem(collectionName, req.params.person_id);

    for (let property in person) {
        if (Array.isArray(person[property]) || (person[property].startsWith('http') && property !== 'url')) {
            const collection = await helpers.getCollectionForItemProperty(collectionName, req.params.person_id, property, property);
            person[property] = collection;
        }
    }

    if (person) {
        res.json(person);
    } else {
        res.status(404).send('No person found.');
    }
}

exports.getFilteredPeople = async function(req, res) {
    let people = await helpers.getCollection(collectionName);
    people = helpers.filterCollection(people, req.query);
    if (people.length != 0) {
        res.json(new CollectionResponse(people));
    } else {
        res.status(404).send('No people found.');
    }
};

exports.getRandomPerson = async function(req, res) {
    let people = await helpers.getCollection(collectionName);
    if (people.length !=0) {
        const randomPerson = people[Math.floor(Math.random() * people.length)];
        res.json(new CollectionResponse(randomPerson));
    } else {
        res.status(404).send('No people found.');
    }
}