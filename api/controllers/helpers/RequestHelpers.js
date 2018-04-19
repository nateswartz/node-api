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

module.exports = {getCollection};