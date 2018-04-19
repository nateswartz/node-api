'use strict';

const CollectionResponse = require('./models/CollectionResponse');
const helpers = require('./helpers/RequestHelpers');

exports.getAllStarships = async function(req, res) {
    const starships = await helpers.getCollection('https://swapi.co/api/starships/?page=1');
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('Error');
    }
};

exports.getFilteredStarships = async function(req, res) {
    let starships = await helpers.getCollection('https://swapi.co/api/starships/?page=1');
    let params = Object.keys(req.query);
    params.forEach(function(param) {
        let results = [];
        starships.forEach(function(item) {
            if ((item[param] > req.query[param]) && item[param] != 'unknown') {
                results.push(item);
            }
        });
        starships = results;
    });
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('Error');
    }
};