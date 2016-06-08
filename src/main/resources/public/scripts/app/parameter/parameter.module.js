var config = require("./parameter.config");
var listController = require("./list.controller");
var parameterService = require("./parameter.service");
var allocationService = require("./allocation.service");
module.exports = angular.module('kanban.parameter', [])
        .config(config)
        .controller("listParameterAdminController", listController)
        .service("parameterService", parameterService)
        .service("allocationService", allocationService);