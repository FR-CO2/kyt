var ganttController = require("./gantt.controller");
module.exports = angular.module('kanban.project.gantt', [])
        .controller("ganttController", ganttController);