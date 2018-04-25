'use strict';

const axios = require('axios');
const fs = require('fs/promises');

const config = require('../../config.json');

async function getCollection(collectionName) {
    let url = config.swapiBaseUrl + collectionName;
    const cacheFileName = url.replace(/\/|\\|\:|\*|\?|\"|\<|\>|\|/g, '') + '.json';
    const cachedResults = await getCachedResults(cacheFileName);
    if (cachedResults) {
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
            await fs.writeFile(cacheFileName, JSON.stringify(collection, null, 2), 'utf-8');
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

async function getItem(collectionName, id) {
    const url = config.swapiBaseUrl + collectionName;
    const cacheFileName = url.replace(/\/|\\|\:|\*|\?|\"|\<|\>|\|/g, '') + '.json';
    const cachedResults = await getCachedResults(cacheFileName);
    if (cachedResults) {
        for (let item of cachedResults) {
            if (item.id === id) {
                return item;
            }
        }
        return null;
    }
    else {
        try {
            const response = await axios.get(url + '/' + id);
            response.data.id = id;
            return response.data;
        } catch (error) {
            return null;
        }
    }
}

async function getCollectionForItemProperty(item, property) {
    let collection = [];
    if (Array.isArray(item[property])) {
        for (let url of item[property]) {
            const pieces = url.split('/');
            const resource = pieces[pieces.length - 3];
            const id = pieces[pieces.length - 2];
            const element = await getItem(resource, id);
            collection.push(element);
        }
    } else {
        const pieces = item[property].split('/');
        const resource = pieces[pieces.length - 3];
        const id = pieces[pieces.length - 2];
        const element = await getItem(resource, id);
        collection.push(element);
    }

    if (collection.length != 0) {
        return collection;
    } else {
        //return "No collection found";
        return [];
    }
}

async function getCachedResults(cacheFileName) {
    try
    {
        const stats = await fs.stat(cacheFileName);
        const modifiedDate = stats.mtime;
        const elapsedMinutes = Math.floor(((new Date() - modifiedDate) / 1000) / 60);
        if (elapsedMinutes < config.cacheLifetimeMinutes)
        {
            return JSON.parse(await fs.readFile(cacheFileName));
        }
        return null;
    } catch (error) {
        return null;
    }
}

module.exports = {getCollection, filterCollection, getItem, getCollectionForItemProperty};