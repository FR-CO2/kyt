var histoController = require("./history.controller");
var histoService = require("./history.service");
module.exports = angular.module('kanban.project.task.history', [])
    .controller("histoController", histoController)
    .service("histoService", histoService);