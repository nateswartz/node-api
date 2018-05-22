'use strict';

const axios = require('axios');
const fs = require('fs');
const util = require('util');

const PokemonModel = require('../models/PokemonModel');

const statAsync = util.promisify(fs.stat);
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

const CollectionResponse = require('../models/CollectionResponse');

const config = require('../../config.json');

const _listCacheFileName = './cache/pokemon_list.json';
const _detailsCacheFileName = './cache/pokemon_details';

exports.getAllItems = async function(req, res) {
    try {
        let items = await getCollection(config.pokemonBaseUrl + req.params.collection,
                                        _listCacheFileName);
        if (req.query.fields) {
            items = filterFields(items, req.query.fields);
        }

        items = items.slice(0, 30);

        let detailedItems = [];
        for (let item of items) {
            const pieces = item.url.split('/');
            const baseUrl = pieces.slice(0, pieces.length - 2).join('/');
            const id = pieces[pieces.length - 2];
            const newItem = await getItem(baseUrl, id, _detailsCacheFileName + id + '.json');
            const cachedResults = await getCachedResults(_detailsCacheFileName + id + '.json');
            if (!cachedResults) {
                await writeFileAsync(_detailsCacheFileName + id + '.json',
                                   JSON.stringify(newItem, null, 2),
                                   'utf-8');
            }
            detailedItems.push(newItem);
        }

        if (detailedItems.length != 0) {
            res.json(new CollectionResponse(detailedItems));
        } else {
            res.status(404).send('No items found.');
        }
    } catch (error) {
        res.status(500).send('Unknown error.');
    }
};

exports.getItem = async function(req, res) {
    try {
        const cacheFileName = _detailsCacheFileName + req.params.item_id + '.json';
        let item = await getItem(config.pokemonBaseUrl + req.params.collection,
                                 req.params.item_id,
                                 cacheFileName);
        const cachedResults = await getCachedResults(cacheFileName);
        if (!cachedResults) {
            await writeFileAsync(cacheFileName,
                            JSON.stringify(item, null, 2),
                            'utf-8');
        }
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

async function getCollection(url, cacheFileName) {
    const cachedResults = await getCachedResults(cacheFileName);
    if (cachedResults) {
        return cachedResults;
    } else {
        let collection = [];
        try {
            while (url != null) {
                console.log('Sending request to ' + url);
                const response = await axios.get(url);
                const data = response.data;
                url = data.next;
                const items = response.data.results;
                items.forEach(function(item) {
                    const pieces = item.url.split('/');
                    const id = pieces[pieces.length - 2];
                    item.id = id;
                });
                collection = collection.concat(data.results);
            }
            await writeFileAsync(cacheFileName, JSON.stringify(collection, null, 2), 'utf-8');
            return collection;
        } catch (error) {
            return [];
        }
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

async function getItem(url, id, cacheFileName) {
    const cachedResults = await getCachedResults(cacheFileName);
    if (cachedResults) {
        return cachedResults;
    } else {
        try {
            console.log('Sending request to ' + url + '/' + id);
            const response = await axios.get(url + '/' + id);
            response.data.id = id;
            console.log('Saving in cache');
            await saveItemToCache(response.data);
            console.log('Saved to cache');
            return response.data;
        } catch (error) {
            return null;
        }
    }
}

async function getCachedResults(cacheFileName, ignoreTime) {
    try {
        if (ignoreTime) {
            return JSON.parse(await readFileAsync(cacheFileName));
        }
        const stats = await statAsync(cacheFileName);
        const modifiedDate = stats.mtime;
        const elapsedMinutes = Math.floor(((new Date() - modifiedDate) / 1000) / 60);
        if (elapsedMinutes < config.cacheLifetimeMinutes) {
            return JSON.parse(await readFileAsync(cacheFileName));
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function saveItemToCache(item) {
        console.log('Saving to mongo');
        console.log(item);
        // Create an instance of model SomeModel
        const pokemonInstance = new PokemonModel(item);

        // Save the new model instance, passing a callback
        try {
            await pokemonInstance.save();
        } catch (error) {
            console.log('Error: ' + error);
        }
        console.log('Saved in mongo');

        const savedItem = await PokemonModel.findOne({name: item.name}).exec();
        console.log(savedItem);
}
