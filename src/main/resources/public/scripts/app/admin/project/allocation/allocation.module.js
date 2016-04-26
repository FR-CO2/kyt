var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.admin.project.allocation', [])
        .controller("listAllocationAdminController", listController)
        .controller("addAllocationAdminController", addController);