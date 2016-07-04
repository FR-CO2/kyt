var listController = require("./list.controller");
module.exports = angular.module('kanban.admin.project.taskhisto', [])
        .controller("listTaskHistoAdminController", listController);