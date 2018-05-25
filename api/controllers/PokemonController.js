'use strict';

const path = require('path');
const axios = require('axios');

const PokemonModel = require('../models/PokemonModel');
const PokemonCollectionCacheModel = require('../models/PokemonCollectionCacheModel');

const CollectionResponse = require('../models/CollectionResponse');

const config = require('../../config.json');

exports.getDescription = async function(req, res) {
    try {
        let projectRootDirectory = __dirname.split(path.sep);
        projectRootDirectory = projectRootDirectory
                                    .slice(0, projectRootDirectory.length - 2)
                                    .join(path.sep);
        res.sendFile(path.join(projectRootDirectory, '/api/static_content/poke_description.html'));
    } catch (error) {
        console.log(error);
        res.status(500).send('Unknown error');
    }
};

exports.getAllItems = async function(req, res) {
    try {
        let items = await getCollection(config.pokemonBaseUrl + req.params.collection);
        if (req.query.fields) {
            items = filterFields(items, req.query.fields);
        }

        let counter = 0;
        let detailedItems = [];
        for (let item of items) {
            const pieces = item.url.split('/');
            const baseUrl = pieces.slice(0, pieces.length - 2).join('/');
            const id = pieces[pieces.length - 2];
            const cached = await checkCacheForPokemon(id);
            if (!cached) {
                counter++;
            }
            const newItem = await getItem(baseUrl, id);
            detailedItems.push(newItem);
            if (counter > 10) {
                break;
            }
        }

        if (items.length != 0) {
            res.json(new CollectionResponse(detailedItems));
        } else {
            res.status(404).send('No items found.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Unknown error.');
    }
};

exports.getItem = async function(req, res) {
    try {
        let item = await getItem(config.pokemonBaseUrl + req.params.collection,
                                 req.params.item_id);
        if (req.query.fields) {
            item = filterFields(item, req.query.fields);
        }
        if (item) {
            res.json(item);
        } else {
            res.status(404).send('No item found.');
        }
    } catch (error) {
        res.status(500).send('Unknown error');
    }
};

// exports.getItemWithInfo = async function(req, res) {
//     try {
//         let item = await helpers.getItem(config.pokemonBaseUrl + req.params.collection,
//                                          req.params.item_id);

//         for (let property in item) {
//             if (Array.isArray(item[property])
//                 || (String(item[property]).startsWith('http') && property !== 'url')) {
//                 const collection = await helpers.getCollectionForItemProperty(item, property);
//                 item[property] = collection;
//             }
//         }

//         if (item) {
//             res.json(item);
//         } else {
//             res.status(404).send('No item found.');
//         }
//     } catch (error) {
//         res.status(500).send('Unknown error');
//     }
// };

// exports.getFilteredItems = async function(req, res) {
//     try {
//         let items = await helpers.getCollection(req.params.collection);
//         items = helpers.filterCollection(items, req.query);
//         if (items.length != 0) {
//             res.json(new CollectionResponse(items));
//         } else {
//             res.status(404).send('No items found.');
//         }
//     } catch (error) {
//         res.status(500).send('Unknown error');
//     }
// };

// exports.getRandomItem = async function(req, res) {
//     try {
//         let items = await helpers.getCollection(req.params.collection);
//         if (items.length !=0) {
//             const randomItem = items[Math.floor(Math.random() * items.length)];
//             res.json(new CollectionResponse(randomItem));
//         } else {
//             res.status(404).send('No items found.');
//         }
//     } catch (error) {
//         res.status(500).send('Unknown error');
//     }
// };

async function getCollection(url) {
    let collection = [];
    try {
        while (url != null) {
            let items = [];
            const cachedItem = await checkCacheForCollection(url);
            if (cachedItem) {
                console.log('Reading item from cache: ' + url);
                url = cachedItem.next;
                items = cachedItem.results;
            } else {
                console.log('Sending request to: ' + url);
                const response = await axios.get(url);
                const data = response.data;
                await saveCollectionResponseToCache(url, data);
                url = data.next;
                items = data.results;
            }
            items.forEach(function(item) {
                const pieces = item.url.split('/');
                const id = pieces[pieces.length - 2];
                item.id = id;
            });
            collection = collection.concat(items);
        }
        return collection;
    } catch (error) {
        console.log(error);
        return [];
    }
}

function filterFields(items, fieldList) {
    if (!Array.isArray(items)) {
        items = [items];
    }
    let fields = fieldList.split(',');
    let resultList = [];
    for (let item of items) {
        let filteredItem = {};
        for (let field of fields) {
            if (item[field]) {
                filteredItem[field] = item[field];
            }
        }
        if (Object.keys(filteredItem).length !== 0) {
            resultList.push(filteredItem);
        };
    }
    return resultList;
}

async function getItem(url, id) {
    const cachedItem = await checkCacheForPokemon(id);
    if (cachedItem) {
        return cachedItem;
    } else {
        try {
            console.log('Sending request to: ' + url + '/' + id);
            const response = await axios.get(url + '/' + id);
            response.data.id = id;
            console.log('Saving in cache');
            const item = await savePokemonToCache(response.data);
            console.log('Saved to cache');
            return item;
        } catch (error) {
            return null;
        }
    }
}

async function checkCacheForCollection(url) {
    console.log('Checking mongo cache for: ' + url);
    const cachedItem = await PokemonCollectionCacheModel.findOne({request_url: url}).exec();
    if (cachedItem) {
        console.log('Found cached item: ' + cachedItem.request_url);
    }
    return cachedItem;
}

async function saveCollectionResponseToCache(requestUrl, response) {
    const pokemonCollectionInstance = new PokemonCollectionCacheModel(response);
    pokemonCollectionInstance.request_url = requestUrl;
    console.log('Saving to mongo: ' + requestUrl);

    try {
        await pokemonCollectionInstance.save();
    } catch (error) {
        console.log('Error: ' + error);
    }
    console.log('Saved in mongo');

    const savedItem = await PokemonCollectionCacheModel.findOne({request_url: requestUrl}).exec();
    return savedItem;
}

async function checkCacheForPokemon(cacheId) {
    console.log('Checking mongo cache for: ' + cacheId);
    const cachedItem = await PokemonModel.findOne({id: cacheId}).exec();
    if (cachedItem) {
        console.log('Found cached item: ' + cacheId);
    }
    return cachedItem;
}

async function savePokemonToCache(item) {
        console.log('Saving to mongo: ' + item.id);
        // Create an instance of model SomeModel
        const pokemonInstance = new PokemonModel(item);

        try {
            await pokemonInstance.save();
        } catch (error) {
            console.log('Error: ' + error);
        }
        console.log('Saved in mongo');

        const savedItem = await PokemonModel.findOne({name: item.name}).exec();
        console.log('First stat name - ' + savedItem.stats[0].stat.name);
        return savedItem;
}
