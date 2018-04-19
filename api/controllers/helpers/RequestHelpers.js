const axios = require('axios');

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