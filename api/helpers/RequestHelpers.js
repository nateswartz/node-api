'use strict';

const axios = require('axios');
const fs = require('fs');
const util = require('util');

const config = require('../../config.json');

const existsAsync = util.promisify(fs.exists);
const statAsync = util.promisify(fs.stat);
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

async function getCollection(url) {
    const cacheFileName = url.replace(/\/|\\|\:|\*|\?|\"|\<|\>|\|/g, '') + '.json';
    if (await shouldUseCache(cacheFileName)) {
        const cachedResults = JSON.parse(await readFileAsync(cacheFileName));
        return cachedResults;
    }
    else {
        let collection = [];
        try {
            while (url != null) {
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

function filterCollection(collection, filters) {
    let results = collection
    for (let attribute in filters) {
        let intermediateResults = [];
        // for non-numeric filters, check filter is substring of attribute
        if (isNaN(filters[attribute])) {
            results.forEach(function(item) {
                if (item[attribute].includes(filters[attribute])){
                    intermediateResults.push(item);
                }
            });
        // for numeric filters, check filter is greater than attribute
        } else {
            results.forEach(function(item) {
                if (parseInt(item[attribute]) > parseInt(filters[attribute])){
                    intermediateResults.push(item);
                }
            });
        }
        results = intermediateResults;
    }
    return results;
}

async function getItem(baseUrl, id) {
    const cacheFileName = baseUrl.replace(/\/|\\|\:|\*|\?|\"|\<|\>|\|/g, '') + '.json';
    if (await shouldUseCache(cacheFileName)) {
        const cachedResults = JSON.parse(await readFileAsync(cacheFileName));
        for (let item of cachedResults) {
            if (item.id === id) {
                return item;
            }
        }
        return null;
    }
    else {
        try {
            const response = await axios.get(baseUrl + '/' + id);
            response.data.id = id;
            return response.data;
        } catch (error) {
            return null;
        }
    }
}

async function getCollectionForItemProperty(itemUrl, id, property, collectionUrl) {
    const item = await getItem(itemUrl, id);
    if (item) {
        let collection = [];
        if (Array.isArray(item[property])) {
            for (let url of item[property]) {
                const pieces = url.split('/');
                const id = pieces[pieces.length - 2];
                const element = await getItem(collectionUrl, id);
                collection.push(element);
            }
        } else {
            const pieces = item[property].split('/');
            const id = pieces[pieces.length - 2];
            const element = await getItem(collectionUrl, id);
            collection.push(element);
        }

        if (collection.length != 0) {
            return collection;
        } else {
            //return "No collection found";
            return [];
        }
    } else {
        //return "No item found";
        return [];
    }
}

async function shouldUseCache(cacheFileName) {
    if (await existsAsync(cacheFileName)) {
        const stats = await statAsync(cacheFileName);
        const modifiedDate = stats.mtime;
        const elapsedMinutes = Math.floor(((new Date() - modifiedDate) / 1000) / 60);
        if (elapsedMinutes < config.cacheLifetimeMinutes)
        {
            return true;
        }
    }
    return false;
}

module.exports = {getCollection, filterCollection, getItem, getCollectionForItemProperty};