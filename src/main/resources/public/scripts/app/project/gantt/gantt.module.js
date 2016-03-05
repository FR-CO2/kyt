(function () {
    define(['angular',
        "project/gantt/gantt.controller"],
            function (angular, ganttController) {
                return angular.module('kanban.project.gantt', [])
                        .controller("ganttController", ganttController);
            });
})();