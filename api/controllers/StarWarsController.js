'use strict';

const axios = require('axios');

class CollectionResponse {
    constructor(collection) {
      this.count = collection.length;
      this.collection = collection;
    }
};

exports.getAllSpecies = async function(req, res) {
    const species = await getCollection('https://swapi.co/api/species/?page=1');
    if (species.length != 0) {
        res.json(new CollectionResponse(species));
    } else {
        res.status(404).send('Error');
    }
};

exports.getAllStarships = async function(req, res) {
    const starships = await getCollection('https://swapi.co/api/starships/?page=1');
    if (starships.length != 0) {
        res.json(new CollectionResponse(starships));
    } else {
        res.status(404).send('Error');
    }
};

async function getCollection(url) {
    let collection = [];
    try {
        while (url != null) {
            const response = await axios.get(url);
            const data = response.data;
            url = data.next;
            collection = collection.concat(data.results);
        }
        return collection;
    } catch (error) {
        return [];
    }
}
