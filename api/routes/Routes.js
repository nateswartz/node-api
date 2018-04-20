'use strict';

module.exports = function(app) {
  var starshipsController = require('../controllers/StarshipsController');
  var speciesController = require('../controllers/SpeciesController');

    app.route('/starwars/species')
        .get(speciesController.getAllSpecies);

    app.route('/starwars/species/filtered')
        .get(speciesController.getFilteredSpecies);

    app.route('/starwars/starships')
        .get(starshipsController.getAllStarships);
    
    app.route('/starwars/starships/filtered')
        .get(starshipsController.getFilteredStarships);
};