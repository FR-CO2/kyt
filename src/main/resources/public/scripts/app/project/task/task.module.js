(function () {
    define(['angular', "project/task/task.service",
        "project/task/task.controller"],
            function (angular, taskService, taskController) {
                return angular.module('kanban.project.task', [])
                        .controller("taskController", taskController)
                        .service("taskService", taskService);
            });
})();