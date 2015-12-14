(function () {
    define(['angular', "project/task/task.module", "project/kanban/kanban.service",
        "project/kanban/kanban.controller"],
            function (angular, taskModule, kanbanService, kanbanController) {
                return angular.module('kanban.project.kanban', [taskModule.name])
                        .controller("kanbanController", kanbanController)
                        .service("kanbanService", kanbanService);
            });
})();