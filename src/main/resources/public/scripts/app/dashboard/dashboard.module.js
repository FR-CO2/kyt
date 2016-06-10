var dashboardController = require("./dashboard.controller");
var addImputationController = require("./calendar/addimputation.controller");
module.exports = angular.module('kanban.dashboard', ["ui.calendar"])
        .controller("dashboardController", dashboardController)
        .controller("addImputationController", addImputationController);