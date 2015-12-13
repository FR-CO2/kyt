(function () {
    define(['angular', "project/kanban/kanban.module", "project/task/task.module",
        "project/project.config", "project/project.controller", "project/project.service"],
            function (angular, kanbanModule, taskModule, config, projectController, projectService) {
                return angular.module('kanban.project', [kanbanModule.name, taskModule.name])
                        .config(config)
                        .controller("projectController", projectController)
                        .service("projectService", projectService);
            });
})();