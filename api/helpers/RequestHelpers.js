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
    const attributes = Object.keys(filters);
    attributes.forEach(function(attribute) {
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
    });
    return results;
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

module.exports = {getCollection, filterCollection};