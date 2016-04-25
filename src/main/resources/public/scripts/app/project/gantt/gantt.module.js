var ganttController = require("./gantt.controller");
module.exports = angular.module("kanban.project.gantt", 
    ["gantt", 'gantt.sortable', 'gantt.movable', 'gantt.overlap', 'gantt.dependencies',
    'gantt.drawtask', 'gantt.tooltips', 'gantt.bounds', 'gantt.progress',
    'gantt.table', 'gantt.tree', 'gantt.groups', 'gantt.resizeSensor'])
        .controller("ganttController", ganttController);
