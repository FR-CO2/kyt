var commentModule = require("./comment/comment.module");
var allocationModule = require("./allocation/allocation.module");
var config = require("./task.config");
var addTaskController = require("./add.controller");
var tasklistController = require("./list.controller");
var taskController = require("./task.controller");
var historyController = require("./history/history.controller");
var taskService = require("./task.service");
var taskAssemblerService = require("./taskAssembler.service");
module.exports = angular.module('kanban.project.task', [commentModule.name, allocationModule.name])
        .config(config)
        .controller("addTaskController", addTaskController)
        .controller("tasklistController", tasklistController)
        .controller("taskController", taskController)
        .controller("historyController", historyController)
        .service("taskService", taskService)
        .service("taskAssemblerService", taskAssemblerService);