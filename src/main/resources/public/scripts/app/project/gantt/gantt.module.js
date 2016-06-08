var ganttController = require("./gantt.controller");
var ganttService = require("./gantt.service");
module.exports = angular.module("kanban.project.gantt", 
    ["gantt", 'gantt.sortable', 'gantt.movable', 'gantt.overlap',
    'gantt.dependencies', 'gantt.tooltips', 'gantt.bounds', 
    'gantt.table', 'gantt.tree', 'gantt.groups', 'gantt.resizeSensor'])
        .controller("ganttController", ganttController)
        .service("ganttService", ganttService);
