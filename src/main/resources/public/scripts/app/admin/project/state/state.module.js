var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.admin.project.state', ['angular-growl'])
        .controller("listStateAdminController", listController)
        .controller("addStateAdminController", addController);