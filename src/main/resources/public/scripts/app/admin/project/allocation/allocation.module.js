var listController = require("./list.controller");
module.exports = angular.module('kanban.admin.project.allocation', [])
        .controller("listAllocationAdminController", listController);