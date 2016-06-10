var kanbanModule = require("./kanban/kanban.module");
var taskModule = require("./task/task.module");
var consommationModule = require("./consommation/consommation.module");
var ganttModule = require("./gantt/gantt.module");
var config = require("./project.config");
var projectController = require("./project.controller");
var projectService = require("./project.service");
module.exports = angular.module('kanban.project',
        [kanbanModule.name, taskModule.name, consommationModule.name,
            ganttModule.name])
        .config(config)
        .controller("projectController", projectController)
        .service("projectService", projectService);