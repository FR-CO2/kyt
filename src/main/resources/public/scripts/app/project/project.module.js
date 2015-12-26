(function () {
    define(['angular', "project/kanban/kanban.module", "project/task/task.module",
        "project/consommation/consommation.module",
        "project/project.config", "project/project.controller",
        "project/project.service"],
            function (angular, kanbanModule, taskModule, consommationModule,
                    config, projectController, projectService) {
                return angular.module('kanban.project',
                    [kanbanModule.name, taskModule.name, consommationModule.name])
                        .config(config)
                        .controller("projectController", projectController)
                        .service("projectService", projectService);
            });
})();