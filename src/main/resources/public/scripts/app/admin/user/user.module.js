var config = require("./user.config");
var listController = require("./list.controller");
var addController = require("./add.controller");
var userService = require("./user.service");
var userRoleService = require("./userrole.service");
module.exports = angular.module('kanban.admin.user', [])
        .config(config)
        .controller("listUserAdminController", listController)
        .controller("addUserAdminController", addController)
        .service("userService", userService)
        .service("userRoleService", userRoleService);
