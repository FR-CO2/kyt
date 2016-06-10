var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.project.task.allocation', [])
        .controller("allocationListController", listController)
        .controller("allocationAddController", addController)