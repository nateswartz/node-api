'use strict';

class Task {
    constructor(title) {
      this.title = title;
    }
};

var tasks = [new Task('Test1')]

exports.listAllTasks = function(req, res) {
    res.json(tasks);
};

exports.createATask = function(req, res) {
    var new_task = new Task(req.body);
    tasks.push(new_task);
    res.send('Task created');
};

exports.readATask = function(req, res) {
    if (tasks.length <= req.params.taskId) {
        res.status(404).send('Task not found');
    }
    res.json(tasks[req.params.taskId]);
};

// exports.updateATask = function(req, res) {
//   Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };

// exports.deleteATask = function(req, res) {
//   Task.remove({
//     _id: req.params.taskId
//   }, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json({ message: 'Task successfully deleted' });
//   });
// };

