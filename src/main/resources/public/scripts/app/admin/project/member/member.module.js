var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.admin.project.member', [])
        .controller("listMemberAdminController", listController)
        .controller("addMemberAdminController", addController);
