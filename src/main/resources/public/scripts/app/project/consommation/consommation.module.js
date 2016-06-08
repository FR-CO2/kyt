var config = require("./consommation.config");
var consommationController = require("./consommation.controller");
var consoService = require("./consommation.service");
module.exports = angular.module('kanban.project.consommation', [])
        .config(config)
        .controller("consommationController", consommationController)
        .service("consomationService", consoService);