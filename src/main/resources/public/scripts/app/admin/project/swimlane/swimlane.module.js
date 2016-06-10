var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.admin.project.swimlane', [])
        .controller("listSwimlaneAdminController", listController)
        .controller("addSwimlaneAdminController", addController);
