var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.admin.project.category', [])
        .controller("listCategoryAdminController", listController)
        .controller("addCategoryAdminController", addController);