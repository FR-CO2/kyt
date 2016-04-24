var loginController = require("./login.controller");
var appAuthService = require("./auth.service");
var currentUserService = require("./currentuser.service");
module.exports = angular.module('kanban.login', [])
        .controller("loginController", loginController)
        .service("appAuthService", appAuthService)
        .service("currentUserService", currentUserService);
