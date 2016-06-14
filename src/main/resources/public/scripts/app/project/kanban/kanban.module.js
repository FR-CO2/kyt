var kanbanController = require("./kanban.controller");
var kanbanService = require("./kanban.service");
var currentuserKanbanFilter = require("./user.filter");
var urgentKanbanFilter = require("./urgent.filter");
module.exports = angular.module('kanban.project.kanban', [])
        .controller("kanbanController", kanbanController)
        .service("kanbanService", kanbanService)
        .filter("currentuserKanbanFilter", currentuserKanbanFilter)
        .filter("urgentKanbanFilter", urgentKanbanFilter);