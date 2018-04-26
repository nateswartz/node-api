'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');

exports.getAllItems = async function(req, res) {
    const items = await helpers.getCollection(req.params.collection);
    if (items.length != 0) {
        res.json(new CollectionResponse(items));
    } else {
        res.status(404).send('No items found.');
    }
};

exports.getItem = async function(req, res) {
    const item = await helpers.getItem(req.params.collection, req.params.item_id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).send('No item found.');
    }
};

exports.getItemWithInfo = async function(req, res) {
    const item = await helpers.getItem(req.params.collection, req.params.item_id);

    for (let property in item) {
        if (Array.isArray(item[property])
            || isNaN(item[property]) && (item[property].startsWith('http') && property !== 'url')) {
            const collection = await helpers.getCollectionForItemProperty(item, property);
            item[property] = collection;
        }
    }

    if (item) {
        res.json(item);
    } else {
        res.status(404).send('No item found.');
    }
};

exports.getFilteredItems = async function(req, res) {
    let items = await helpers.getCollection(req.params.collection);
    items = helpers.filterCollection(items, req.query);
    if (items.length != 0) {
        res.json(new CollectionResponse(items));
    } else {
        res.status(404).send('No items found.');
    }
};

exports.getRandomItem = async function(req, res) {
    let items = await helpers.getCollection(req.params.collection);
    if (items.length !=0) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        res.json(new CollectionResponse(randomItem));
    } else {
        res.status(404).send('No items found.');
    }
};
