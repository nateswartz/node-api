'use strict';

const CollectionResponse = require('../models/CollectionResponse');
const helpers = require('../helpers/RequestHelpers.js');
const path = require('path');

const config = require('../../config.json');

exports.getDescription = async function(req, res) {
    try {
        let projectRootDirectory = __dirname.split(path.sep);
        projectRootDirectory = projectRootDirectory
                                    .slice(0, projectRootDirectory.length - 2)
                                    .join(path.sep);
        res.sendFile(path.join(projectRootDirectory, '/api/static_content/swapi_description.html'));
    } catch (error) {
        console.log(error);
        res.status(500).send('Unknown error');
    }
};

exports.getAllItems = async function(req, res) {
    try {
        let items = await helpers.getCollection(config.swapiBaseUrl + req.params.collection);
        if (req.query.fields) {
            items = helpers.filterFields(items, req.query.fields);
        }
        if (items.length != 0) {
            res.json(new CollectionResponse(items));
        } else {
            res.status(404).send('No items found.');
        }
    } catch (error) {
        res.status(500).send('Unknown error');
    }
};

exports.getItem = async function(req, res) {
    try {
        let item = await helpers.getItem(config.swapiBaseUrl + req.params.collection,
                                         req.params.item_id);
        if (req.query.fields) {
            item = helpers.filterFields(item, req.query.fields);
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

exports.getItemWithInfo = async function(req, res) {
    try {
        let item = await helpers.getItem(config.swapiBaseUrl + req.params.collection,
                                         req.params.item_id);

        for (let property in item) {
            if (Array.isArray(item[property])
                || (String(item[property]).startsWith('http') && property !== 'url')) {
                const collection = await helpers.getCollectionForItemProperty(item, property);
                item[property] = collection;
            }
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

exports.getFilteredItems = async function(req, res) {
    try {
        let items = await helpers.getCollection(config.swapiBaseUrl + req.params.collection);
        items = helpers.filterCollection(items, req.query);
        if (items.length != 0) {
            res.json(new CollectionResponse(items));
        } else {
            res.status(404).send('No items found.');
        }
    } catch (error) {
        res.status(500).send('Unknown error');
    }
};

exports.getRandomItem = async function(req, res) {
    try {
        let items = await helpers.getCollection(config.swapiBaseUrl + req.params.collection);
        if (items.length !=0) {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            res.json(new CollectionResponse(randomItem));
        } else {
            res.status(404).send('No items found.');
        }
    } catch (error) {
        res.status(500).send('Unknown error');
    }
};
