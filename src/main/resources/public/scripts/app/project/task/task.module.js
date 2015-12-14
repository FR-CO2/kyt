(function () {
    define(['angular', "project/task/task.config", "project/task/task.service",
        "project/task/task.controller", "project/task/tasklist.controller"],
            function (angular, config, taskService, taskController, tasklistController) {
                return angular.module('kanban.project.task', [])
                        .config(config)
                        .controller("taskController", taskController)
                        .controller("tasklistController", tasklistController)
                        .service("taskService", taskService);
            });
})();