'use strict';

const starWarsController = require('../controllers/StarWarsController');

module.exports = function(app) {
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
};
