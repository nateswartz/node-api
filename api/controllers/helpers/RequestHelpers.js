const axios = require('axios');
const fs = require('fs');
const util = require('util');

const existsAsync = util.promisify(fs.exists);
const statAsync = util.promisify(fs.stat);
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

async function getCollection(url) {
    let useCacheFile = false;
    // Get filesafe name \/:*?"<>|
    const cacheFile = url.replace(/\/|\\|\:|\*|\?|\"|\<|\>|\|/g, '') + '.json';
    if (await existsAsync(cacheFile)) {
        const stats = await statAsync(cacheFile);
        const modifiedDate = stats.mtime;
        const elapsedMinutes = Math.floor(((new Date() - modifiedDate) / 1000) / 60);
        if (elapsedMinutes < 60)
        {
            useCacheFile = true;
        }
    }
    if (useCacheFile) {
        const cachedResults = JSON.parse(await readFileAsync(cacheFile));
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
            await writeFileAsync(cacheFile, JSON.stringify(collection, null, 2), 'utf-8');
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
        results.forEach(function(item) {
            console.log(item[attribute]);
            console.log(filters[attribute]);
            if (parseInt(item[attribute]) > parseInt(filters[attribute])){
                intermediateResults.push(item);
            }
        });
        results = intermediateResults;
    });
    return results;
}

module.exports = {getCollection, filterCollection};