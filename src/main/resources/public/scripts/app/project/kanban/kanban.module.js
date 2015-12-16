(function () {
    define(['angular', "project/kanban/kanban.service",
        "project/kanban/kanban.controller"],
            function (angular, kanbanService, kanbanController) {
                return angular.module('kanban.project.kanban', [])
                        .controller("kanbanController", kanbanController)
                        .service("kanbanService", kanbanService);
            });
})();