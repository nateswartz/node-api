'use strict';
module.exports = function(app) {
  var controller = require('../controllers/Controller');
  var sw_controller = require('../controllers/StarWarsController');

    app.route('/tasks')
        .get(controller.listAllTasks)
        .post(controller.createATask);

    app.route('/tasks/:taskId')
        .get(controller.readATask);
//     .put(controller.updateATask)
//     .delete(controller.deleteATask);

    app.route('/starwars/species')
        .get(sw_controller.getAllSpecies);

    app.route('/starwars/starships')
        .get(sw_controller.getAllStarships);
};