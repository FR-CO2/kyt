var kanbanController = require("./kanban.controller");
var kanbanService = require("./kanban.service");
module.exports = angular.module('kanban.project.kanban', [])
        .controller("kanbanController", kanbanController)
        .service("kanbanService", kanbanService);