'use strict';

const baseController = require('../controllers/BaseController');
const starWarsController = require('../controllers/StarWarsController');
const pokemonController = require('../controllers/PokemonController');

module.exports = function(app) {
    app.route('/')
        .get(baseController.getDescription);

    app.route('/starwars')
        .get(starWarsController.getDescription);

    app.route('/starwars/:collection')
        .get(starWarsController.getAllItems);

    // Ordering is important, filtered and random must come before item
    app.route('/starwars/:collection/filtered')
        .get(starWarsController.getFilteredItems);

    app.route('/starwars/:collection/random')
        .get(starWarsController.getRandomItem);

    app.route('/starwars/:collection/:item_id')
        .get(starWarsController.getItem);

    app.route('/starwars/:collection/:item_id/info')
        .get(starWarsController.getItemWithInfo);

    app.route('/pokemon/:collection/:item_id/')
        .get(pokemonController.getItem);

    app.route('/pokemon')
        .get(pokemonController.getDescription);

    app.route('/pokemon/:collection/')
        .get(pokemonController.getAllItems);
};
