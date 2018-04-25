'use strict';

module.exports = function(app) {
  var starshipsController = require('../controllers/StarshipsController');
  var speciesController = require('../controllers/SpeciesController');
  var peopleController = require('../controllers/PeopleController');
  var planetsController = require('../controllers/PlanetsController');

    app.route('/starwars/species')
        .get(speciesController.getAllSpecies);

    app.route('/starwars/species/filtered')
        .get(speciesController.getFilteredSpecies);

    app.route('/starwars/species/:species_id')
        .get(speciesController.getSpecies);

    app.route('/starwars/species/:species_id/all')
        .get(speciesController.getAllSpeciesInfo);

    app.route('/starwars/starships')
        .get(starshipsController.getAllStarships);

    app.route('/starwars/starships/:starship_id')
        .get(starshipsController.getStarship);

    app.route('/starwars/starships/:starship_id/all')
        .get(starshipsController.getAllStarshipInfo);
    
    app.route('/starwars/starships/filtered')
        .get(starshipsController.getFilteredStarships);

    app.route('/starwars/people')
        .get(peopleController.getAllPeople);

    app.route('/starwars/people/:person_id')
        .get(peopleController.getPerson);

    app.route('/starwars/people/:person_id/all')
        .get(peopleController.getAllPersonInfo);
    
    app.route('/starwars/people/filtered')
        .get(peopleController.getFilteredPeople);

    app.route('/starwars/people/random')
        .get(peopleController.getRandomPerson);

    app.route('/starwars/planets')
        .get(planetsController.getAllPlanets);
    
    app.route('/starwars/planets/filtered')
        .get(planetsController.getFilteredPlanets);

    app.route('/starwars/planets/random')
        .get(planetsController.getRandomPlanet);

    app.route('/starwars/planets/:planet_id')
        .get(planetsController.getPlanet);

    app.route('/starwars/planets/:planet_id/all')
        .get(planetsController.getAllPlanetInfo);
};